const DPI = require('@DPI');

const utilsList = [
    'slackApis',
    'razorpay',
];

utilsList.forEach((util) => {
  DPI.factory(util, () => require(`./${util}`));
});
