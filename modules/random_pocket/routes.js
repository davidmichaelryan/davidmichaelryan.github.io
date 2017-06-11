require('dotenv').load();

module.exports = (app) => {
  app.get('/random_pocket', (req, res) => {
    res.render('modules/random_pocket');
  });
};
