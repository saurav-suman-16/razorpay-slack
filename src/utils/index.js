const DPI = require("@DPI");

const utilsList = ["secrets", "slackApis", "razorpay"];

utilsList.forEach((util) => {
  DPI.factory(util, () => require(`./${util}`));
});
