/* global window */

window.confirmArrival = require('./confirmArrival.js');
const FoodMap = require('./FoodMap.js');

window.initMap = () => {
  window.FoodMap = new FoodMap(window.google);
};
