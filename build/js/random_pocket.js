(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

const RandomPocket = require('./randomPocket.js');

const randomPocketInit = () => {
  return new RandomPocket();
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = randomPocketInit;
}

window.randomPocketInit = randomPocketInit;

},{"./randomPocket.js":2}],2:[function(require,module,exports){
'use strict';

class RandomPocket {
  constructor() {
    return this.authorize();
  }

  authorize() {
    return $.post('/authorize', data => {
      $('.auth').hide();
      $('.random').show();
      return this.createGetterEvent();
    });
  }

  getBaseURL(fullUrl) {
    const divided = fullUrl.split('/');
    const baseUrl = divided[2];
    return baseUrl;
  }

  createGetterEvent() {
    return $("#random-button").click(() => {
      $.post("/random", data => {
        const title = data.resolved_title;
        const website = this.getBaseURL(data.resolved_url);
        const pocketUrl = `http://getpocket.com/a/read/${data.item_id}`;
        const realUrl = data.resolved_url;

        $(".random .title").html(title);
        $(".random .website").html(website);
        $(".random .pocket_url").attr('href', pocketUrl);
        $(".random .og_url").attr('href', realUrl);
        $("#delete-button").attr('data-pocketid', data.item_id);
        $(".random .article-info").show();
      });
    });
  }
}

module.exports = RandomPocket;

},{}]},{},[1]);
