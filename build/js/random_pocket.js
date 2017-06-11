(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var RandomPocket = require('./randomPocket.js');

var randomPocketInit = function randomPocketInit() {
  return new RandomPocket();
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = randomPocketInit;
}

window.randomPocketInit = randomPocketInit;

},{"./randomPocket.js":2}],2:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RandomPocket = function () {
  function RandomPocket() {
    _classCallCheck(this, RandomPocket);

    return this.authorize();
  }

  _createClass(RandomPocket, [{
    key: 'authorize',
    value: function authorize() {
      var _this = this;

      return $.post('/authorize', function (data) {
        $('.auth').hide();
        $('.random').show();
        return _this.createGetterEvent();
      });
    }
  }, {
    key: 'getBaseURL',
    value: function getBaseURL(fullUrl) {
      var divided = fullUrl.split('/');
      var baseUrl = divided[2];
      return baseUrl;
    }
  }, {
    key: 'createGetterEvent',
    value: function createGetterEvent() {
      var _this2 = this;

      return $('#random-button').click(function () {
        $.post('/random', function (data) {
          var title = data.resolved_title;
          var website = _this2.getBaseURL(data.resolved_url);
          var pocketUrl = 'http://getpocket.com/a/read/' + data.item_id;
          var realUrl = data.resolved_url;

          $('.random .title').html(title);
          $('.random .website').html(website);
          $('.random .pocket_url').attr('href', pocketUrl);
          $('.random .og_url').attr('href', realUrl);
          $('#delete-button').attr('data-pocketid', data.item_id);
          $('.random .article-info').show();
        });
      });
    }
  }]);

  return RandomPocket;
}();

module.exports = RandomPocket;

},{}]},{},[1]);
