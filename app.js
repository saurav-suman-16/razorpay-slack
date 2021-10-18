require('module-alias/register');

const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const { port, db } = require('config');
const DPI = require('@DPI');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

require('./DBA');
require('./utils');
require('./managers');
require('./views');
require('./routes').init(app);

app.get(`/health`, (req, res) => {
  res.json({ status: 'Server running.' });
});

mongoose
  .connect(`${db.url}/${db.name}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Mongo Connected');
  })
  .catch((error) => {
    console.log('Error Connecting Mongo', error);
  });

app.listen(port, () => {
  console.log('Razorpay Server started on', port);
});

module.exports = app;
