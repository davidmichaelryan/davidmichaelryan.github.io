/* global window, document, $ */

const countdown = require('./countdown.js');

const RandomPocket = require('./RandomPocket.js');

const randomPocketInit = () => {
  if (window.loggedIn) { return new RandomPocket(); }
  return $(document).ready(countdown);
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = randomPocketInit;
}

window.randomPocketInit = randomPocketInit;
