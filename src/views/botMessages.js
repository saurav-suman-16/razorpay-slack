exports.sendPaymentLink = ({ channel, url, description }) => {
  const blocks = [];
  if (description) {
    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: `Payment For: ${description}`,
      },
    });
  }
  blocks.push(
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `Payment link: ${url}`,
      },
    },
    {
      type: "actions",
      elements: [
        {
          type: "button",
          action_id: "acknowledge_request",
          text: {
            type: "plain_text",
            text: "Make Payment",
          },
          url,
        },
      ],
    }
  );

  return {
    channel,
    text: "Here is your payment link",
    blocks,
  };
};
