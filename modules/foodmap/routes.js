'use strict';

module.exports = (app) => {
  app.get('/foodmap', (req, res) => {
    res.render('modules/foodmap');
  });
};
