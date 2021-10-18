const config = require('config');

exports.appHomeView = ({ workspace = {}, userId }) => {
  const { razorpayKeySecret, razorpayKeyId } = workspace;
  const view = {
    type: 'home',
    blocks: [
      {
        type: 'section',
        text: {
          type: 'plain_text',
          text: `
          Hello 👋🏼\n
I can help you generate a payment link for your razorpay account without leaving slack.\n
All I need is an API key.\n\n
To generate the link write 'payment [amount] [description]' in the message. eg: payment 10000 Paying for food\n
The amount should be in the smallest currency value. i.e For INR 100 you need to enter 10000\n\n
You can generate the key form the API Keys tab in Settings on Razorpay Dashboard`,
          emoji: true,
        },
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'Razorpay Dashboard',
              emoji: true,
            },
            url: config.razorPayApiKeyLink,
          },
        ],
      },
      {
        type: 'divider',
      },
    ],
  };
  if (userId === workspace.memberId) {
    if (razorpayKeySecret && razorpayKeyId) {
      view.blocks.push(
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: 'You have a razorpay account configured 👍🏽',
          },
          accessory: {
            type: 'button',
            text: {
              type: 'plain_text',
              text: '🧾 View Configuration',
              emoji: true,
            },
            action_id: 'viewRazorpayConfiguration',
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: 'Need to edit the config?',
          },
          accessory: {
            type: 'button',
            text: {
              type: 'plain_text',
              text: '📝 Edit Configuration',
              emoji: true,
            },
            action_id: 'razorpayConfiguration',
          },
        },
      );
    } else {
      view.blocks.push({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '🤔 Hmm...,\nLooks like I do not have any razorpay account configured for you.',
        },
        accessory: {
          type: 'button',
          text: {
            type: 'plain_text',
            text: '⚙️ Configure Now',
            emoji: true,
          },
          action_id: 'razorpayConfiguration',
        },
      });
    }
  } else {
    view.blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '🤔 Hmm...,\nLooks like You are not the installer of the app. Only the installer has the access to add or update the razorpay configuration',
      },
    });
  }
  return view;
};
