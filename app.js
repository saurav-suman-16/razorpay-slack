require("module-alias/register");
const mongoose = require("mongoose");
const express = require("express");
const logger = require("morgan");
const { port, db } = require("config");

const { app, receiver } = require("./bolt-app");

const { router } = receiver;

router.use(logger("dev"));
router.use(express.json());
router.use(express.urlencoded({ extended: false }));

require("./src/DBA");
require("./src/utils");
require("./src/managers");
require("./src/views");
require("./src/routes").init(router);
require("./src/handlers")(app);

mongoose
  .connect(`${db.url}/${db.name}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Mongo Connected");
  })
  .then(async () => {
    await app.start(port);
    console.log("Razorpay Server started on", port);
  })
  .catch((error) => {
    console.log("Error Connecting Mongo", error);
  });
