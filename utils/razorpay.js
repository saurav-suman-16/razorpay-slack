const axios = require('axios');
const config = require('config');

exports.generatePaymentLink = async ({
  amount,
  description = '',
  upi = false,
  workspace,
}) => {
    console.log({
        username: workspace.razorpayKeyId,
        password: workspace.razorpayKeySecret,
      })
  let paymentLinkData = await axios.post(
    config.razorPayPaymentLinkGenerationLink,
    {
      upi_link: `${upi}`,
      amount: Number(amount),
      currency: 'INR',
      description,
      notify: {
        sms: true,
        email: true,
      },
    },
    {
      auth: {
        username: workspace.razorpayKeyId,
        password: workspace.razorpayKeySecret,
      },
    },
  );
  return paymentLinkData?.data?.short_url;
};
