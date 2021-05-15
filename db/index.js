const db = require('./db');

module.exports = (app) => {
  app.use('/', db);
};
