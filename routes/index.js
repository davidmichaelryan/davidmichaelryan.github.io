const assign = require('lodash').assign;
const dotenv = require('dotenv');

const basePartials = {
  head: 'head',
  header: 'header',
  footer: 'footer',
};

dotenv.load();

const routes = (app) => {
  app.use((req, res, next) => {
    next();
  });

  app.get('/', (req, res) => {
    const indexPartials = assign({}, basePartials, { work: 'work' });
    res.render('index', { partials: indexPartials });
  });
};

module.exports = routes;
