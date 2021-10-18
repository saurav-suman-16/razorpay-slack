const axios = require('axios');
const config = require('config');
const DPI = require('@DPI');

// Auth from slack and upsert the workspace data in the db
exports.appInstall = async ({ code }) => {
  let authResult = await axios.get(
    `${config.slackBaseUrl}/api/oauth.v2.access`,
    {
      params: {
        client_id: config.slack.client_id,
        client_secret: config.slack.client_secret,
        scope: 'commands',
        code,
      },
    },
  );
  authResult = authResult.data;
  if (authResult.error) {
    throw new Error(authResult.error);
  }
  await DPI.get('workspacesDBA').findOneAndUpdate(
    { teamID: authResult?.team?.id },
    {
      teamID: authResult?.team?.id,
      teamName: authResult?.team?.name,
      memberId: authResult?.authed_user?.id,
      accessToken: authResult?.access_token,
    },
  );
  return `slack://app?team=${authResult?.team?.id}&id=${config.slack.app_id}&tab=home`;
};

// ============================= Events Control =============================
const handleMessage = async ({ workspace, payload }) => {
  let {
    event: { text, user },
  } = payload;
  text = text?.trim();
  if (text?.match(/^[\s]*payment/)) {
    const textParams = text.split(' ');
    let amount = textParams[1];
    amount = amount && Number(amount);
    if (amount) {
      let description = text.slice(text.indexOf(' ') + 1);
      description = description.slice(description.indexOf(' ') + 1);
      const url = await DPI.get('razorpay').generatePaymentLink({
        amount,
        description,
        workspace,
      });
      return DPI.get('slackApis').sendMessage({
        token: workspace?.accessToken,
        messageDetails: DPI.get('botMessages').sendPaymentLink({
          channel: user,
          url,
        }),
      });
    }

  }
  return true;
};

exports.slackEvents = async ({ payload }) => {
  const { team_id, event } = payload;
  const workspace = await DPI.get('workspacesDBA').findOne({
    teamID: team_id,
  });
  if (!workspace) {
    const error = new Error('Workspace Data not found');
    error.code = 404;
    throw error;
  }
  switch (event?.type) {
    case 'app_home_opened':
      return DPI.get('slackApis').openAppHome({
        token: workspace?.accessToken,
        userID: workspace?.memberId,
        view: DPI.get('appHome').appHomeView({
          workspace,
          userId: payload?.event?.user,
        }),
      });
    case 'message':
      return handleMessage({ workspace, payload });
    default:
      return true;
  }
};

// ============================= Interaction Control =============================

const handleAction = async ({ workspace, payload }) => {
  const { actions = [], trigger_id } = payload;
  switch (actions?.[0]?.action_id) {
    case 'razorpayConfiguration':
      return DPI.get('slackApis').openModal({
        token: workspace?.accessToken,
        triggerID: trigger_id,
        modalData: DPI.get('razorpayConfiguration').setConfigModal(),
      });
    case 'viewRazorpayConfiguration':
      return DPI.get('slackApis').openModal({
        token: workspace?.accessToken,
        triggerID: trigger_id,
        modalData: DPI.get('razorpayConfiguration').getConfigModal({
          workspace,
        }),
      });
    case 'default':
      break;
  }
};

const handleViewSubmission = async ({ workspace, payload }) => {
  const { view } = payload;
  switch (view?.callback_id) {
    case 'razorpayConfiguration':
      return DPI.get('workspaceManager').razorpayConfiguration({
        workspace,
        payload,
      });
    case 'default':
      break;
  }
};

exports.interactiveEvents = async ({ payload }) => {
  const { team, actions = [], type } = payload;
  const workspace = await DPI.get('workspacesDBA').findOne({
    teamID: team?.id,
  });
  if (!workspace) {
    const error = new Error('Workspace Data not found');
    error.code = 404;
    throw error;
  }
  console.log(actions);
  if (actions.length) {
    return handleAction({ workspace, payload });
  }
  if (type === 'view_submission') {
    return handleViewSubmission({ workspace, payload });
  }
};
