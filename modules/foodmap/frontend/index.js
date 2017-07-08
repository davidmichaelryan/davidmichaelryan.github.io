window.confirmArrival = require('./confirmArrival.js');
const FoodMap = require('./FoodMap.js');

window.initMap = function () {
  window.FoodMap = new FoodMap(window.google);
};

