const baseRoute = '/api';

exports.init = (app) => {
  app.use(`${baseRoute}/slack`, require('./slack').router);
};
