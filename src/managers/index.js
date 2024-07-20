const DPI = require("@DPI");

const managersList = ["workspace"];

managersList.forEach((manager) => {
  DPI.factory(`${manager}Manager`, () => require(`./${manager}`));
});
