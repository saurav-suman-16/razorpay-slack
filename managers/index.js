const DPI = require('@DPI');

const managersList = [
    'slack',
    'workspace',
];

managersList.forEach((manager) => {
  DPI.factory(`${manager}Manager`, () => require(`./${manager}`));
});
