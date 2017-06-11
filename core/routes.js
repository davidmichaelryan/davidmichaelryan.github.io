/* eslint global-require: 0 */
const dotenv = require('dotenv');

dotenv.load();

const routes = (app) => {
  app.use((req, res, next) => {
    next();
  });

  [
    require('../modules/homepage/routes'),
    require('../modules/foodmap/routes'),
    require('../modules/random_pocket/routes'),
  ].map(initRoute => initRoute(app));
};

module.exports = routes;
