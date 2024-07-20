const DPI = require('@DPI');
const { WebClient } = require('@slack/web-api');

exports.openAppHome = async ({ token, userID, view }) => {
  const webClient = new WebClient(token);
  return webClient.views.publish({ user_id: userID, view });
};

exports.openModal = async ({ token, triggerID, modalData }) => {
  const webClient = new WebClient(token);
  return webClient.views.open({ trigger_id: triggerID, view: modalData });
};

exports.sendMessage = async ({ token, messageDetails }) => {
  const webClient = new WebClient(token);
  return webClient.chat.postMessage(messageDetails);
};
