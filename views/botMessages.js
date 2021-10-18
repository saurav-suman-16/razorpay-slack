exports.sendPaymentLink = ({ channel, url }) => ({
  channel,
  text: 'Here is your payment link',
  blocks: [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `Payment link: ${url}`,
      },
    },
    {
      type: 'actions',
      elements: [
        {
          type: 'button',
          action_id: 'makePayment',
          text: {
            type: 'plain_text',
            text: 'Make Payment',
          },
          url,
        },
      ],
    },
  ],
});
