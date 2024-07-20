const DPI = require("@DPI");

exports.init = (router) => {
  router.post(`/health`, (req, res) => {
    console.log("Health check");
    res.json({ status: "Server running." });
  });
};
