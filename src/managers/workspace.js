const DPI = require('@DPI');

exports.razorpayConfiguration = async ({ workspace, payload = {} }) => {
  const { triggerId, view: { state: { values } = {} } = {} } = payload;
  const { key_id = {}, key_secret = {} } = values;
  await DPI.get('workspacesDBA').findOneAndUpdate(
    { _id: workspace._id },
    { razorpayKeyId: key_id?.key_id?.value, razorpayKeySecret: key_secret?.key_secret?.value },
  );
  return {
    response_action: 'update',
    view: {
      type: 'modal',
      title: {
        type: 'plain_text',
        text: 'Razorpay Configuration',
      },
      blocks: [
        {
          type: 'section',
          text: {
            type: 'plain_text',
            text: 'Configuration Saved Successfully',
          },
        },
      ],
    },
  };
};
