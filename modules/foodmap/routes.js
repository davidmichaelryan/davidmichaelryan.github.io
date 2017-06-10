module.exports = function (app) {
  app.get('/foodmap', (req, res) => {
    res.render('modules/foodmap');
  });
};
