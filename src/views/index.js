const DPI = require('@DPI');

const viewList = ['appHome', 'razorpayConfiguration', 'botMessages'];

viewList.forEach((view) => {
  DPI.factory(`${view}`, () => require(`./${view}`));
});
