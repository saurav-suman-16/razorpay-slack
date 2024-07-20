const axios = require("axios");
const config = require("config");

exports.generatePaymentLink = async ({
  amount,
  description = "",
  upi = false,
  workspace,
}) => {
  try {
    let paymentLinkData = await axios.post(
      config.razorPayPaymentLinkGenerationLink,
      {
        upi_link: `${upi}`,
        amount: Number(amount),
        currency: "INR",
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
      }
    );
    return { ok: true, url: paymentLinkData?.data?.short_url };
  } catch (error) {
    console.error(
      "Error in generating payment link:",
      error,
      JSON.stringify(error?.response?.data?.error)
    );
    if (error?.response?.data?.error?.description) {
      return { ok: false, error: error.response.data.error.description };
    }
    throw error;
  }
};
