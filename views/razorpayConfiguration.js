const baseModal = {
  type: 'modal',
  callback_id: 'razorpayConfiguration',
  title: {
    type: 'plain_text',
    text: 'Razorpay Configuration',
    emoji: true,
  },
  close: {
    type: 'plain_text',
    text: 'Close',
    emoji: true,
  },
};

exports.setConfigModal = () => ({
  ...baseModal,
  submit: {
    type: 'plain_text',
    text: 'Submit',
    emoji: true,
  },
  blocks: [
    {
      block_id: 'key_id',
      type: 'input',
      element: {
        type: 'plain_text_input',
        action_id: 'key_id',
        placeholder: {
          type: 'plain_text',
          text: 'Razorpay Key Id',
          emoji: true,
        },
      },
      label: {
        type: 'plain_text',
        text: 'Key Id',
      },
    },
    {
      block_id: 'key_secret',
      type: 'input',
      element: {
        type: 'plain_text_input',
        action_id: 'key_secret',
        placeholder: {
          type: 'plain_text',
          text: 'Razorpay Key Secret',
          emoji: true,
        },
      },
      label: {
        type: 'plain_text',
        text: 'Key Secret',
        emoji: true,
      },
    },
  ],
});

exports.getConfigModal = ({ workspace }) => ({
  ...baseModal,
  blocks: [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `Razorpay Key Id: *${workspace?.razorpayKeyId}*`,
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `Razorpay Key Secret: *${workspace?.razorpayKeySecret}*`,
      },
    },
  ],
});
