const assign = require('lodash').assign;
const dotenv = require('dotenv');

dotenv.load();

const routes = (app, basePartials) => {
    app.use((req, res, next) => {
        next();
    });

    [
        require('../modules/homepage/routes'),
        require('../modules/foodmap/routes'),
    ].map((initRoute) => initRoute(app));
};

module.exports = routes;
