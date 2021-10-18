const DPI = require('@DPI');

const DBAList = ['workspaces'];

DBAList.forEach((DBA) => {
  DPI.factory(`${DBA}DBA`, () => require(`./${DBA}`));
});
