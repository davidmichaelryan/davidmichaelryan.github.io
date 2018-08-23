(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* global $ */
/* eslint class-methods-use-this: 0 */

var RandomPocket = function () {
  function RandomPocket() {
    _classCallCheck(this, RandomPocket);

    this.articleBuffer = [];
    return this.authorize();
  }

  _createClass(RandomPocket, [{
    key: 'getBaseURL',
    value: function getBaseURL(fullUrl) {
      var divided = fullUrl.split('/');
      var baseUrl = divided[2];
      return baseUrl;
    }
  }, {
    key: 'makeArticlePreview',
    value: function makeArticlePreview(data) {
      var title = data.resolved_title;
      var website = this.getBaseURL(data.resolved_url);
      var pocketUrl = 'http://getpocket.com/a/read/' + data.item_id;
      var realUrl = data.resolved_url;

      $('.subtitle').hide();
      $('.random .title').html(title);
      $('.random .website').html(website);
      $('.random .pocket_url').attr('href', pocketUrl);
      $('.random .og_url').attr('href', realUrl);
      $('#delete-button').attr('data-pocketid', data.item_id);
      $('.random .article-info').show();
    }
  }, {
    key: 'createGetterEvent',
    value: function createGetterEvent() {
      var _this = this;

      return $('#random-button').click(function () {
        if (_this.articleBuffer.length < 3) {
          if (_this.articleBuffer.length) {
            _this.makeArticlePreview(_this.articleBuffer.pop());
            $.post('/random_pocket/random', function (articles) {
              _this.articleBuffer = _this.articleBuffer.concat(articles);
            });
          } else {
            $.post('/random_pocket/random', function (articles) {
              _this.makeArticlePreview(articles.pop());
              _this.articleBuffer = _this.articleBuffer.concat(articles);
            });
          }
        } else {
          _this.makeArticlePreview(_this.articleBuffer.pop());
        }
      });
    }
  }, {
    key: 'authorize',
    value: function authorize() {
      var _this2 = this;

      return $.post('/random_pocket/authorize', function () {
        $('.auth').hide();
        $('.random').show();
        return _this2.createGetterEvent();
      });
    }
  }]);

  return RandomPocket;
}();

module.exports = RandomPocket;

},{}],2:[function(require,module,exports){
'use strict';

/* global $ */

var countdown = function countdown() {
  var $titleHeader = $('.title_header');
  return $({ countNum: 0 }).animate({
    countNum: 999
  }, {
    duration: 1500,
    step: function step() {
      return $titleHeader.attr('data-num', 999 - Math.floor(this.countNum));
    },

    complete: function complete() {
      if ($titleHeader.attr('data-num') !== 0) {
        $titleHeader.attr('data-num', 0);
      }
      $titleHeader.addClass('hide');

      return setTimeout(function () {
        $titleHeader.attr('data-num', '😎').removeClass('hide');
      }, 400);
    }
  });
};

module.exports = countdown;

},{}],3:[function(require,module,exports){
'use strict';

/* global window, document, $ */

var countdown = require('./countdown.js');

var RandomPocket = require('./RandomPocket.js');

var randomPocketInit = function randomPocketInit() {
  if (window.loggedIn) {
    return new RandomPocket();
  }
  return $(document).ready(countdown);
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = randomPocketInit;
}

window.randomPocketInit = randomPocketInit;

},{"./RandomPocket.js":1,"./countdown.js":2}]},{},[3]);
