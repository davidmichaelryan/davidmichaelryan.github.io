'use strict';

const RandomPocket = require('./randomPocket.js');

const randomPocketInit = () => {
  return new RandomPocket();
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = randomPocketInit;
} 

window.randomPocketInit = randomPocketInit;
