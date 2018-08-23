(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* global window */

var MapHandler = require('./MapHandler.js');
var FormHandler = require('./FormHandler.js');
var PathFinder = require('./PathFinder');
var confirmArrival = require('./confirmArrival.js');

window.confirmArrival = confirmArrival;

var getFlavorTownData = function getFlavorTownData() {
  if (confirmArrival().flavortown !== true || !window.flavortown) {
    throw new Error('flavortown assets have not loaded');
  } else {
    return window.flavortown;
  }
};

var FoodMap = function () {
  function FoodMap(google) {
    _classCallCheck(this, FoodMap);

    this.infoWindows = [];
    this.markers = [];

    this.mapHandler = new MapHandler(google, 'map');
    this.initGoogleMaps();
    this.mapHandler.setOnResizeListener();

    this.formHandler = new FormHandler('map-form');
    this.formHandler.disableBtnDefault('submit');

    this.pathFinder = new PathFinder();
  }

  _createClass(FoodMap, [{
    key: 'initGoogleMaps',
    value: function initGoogleMaps() {
      this.mapHandler.initMap({
        lat: 41.8781,
        lng: -87.6298,
        mapType: 'ROADMAP'
      });
    }
  }, {
    key: 'clearMapData',
    value: function clearMapData() {
      this.markers.map(function (marker) {
        return marker.setMap(null);
      });
      this.infoWindows = [];
      this.markers = [];
    }
  }, {
    key: 'searchForStops',
    value: function searchForStops(directionsData) {
      var flavortown = getFlavorTownData();
      return this.pathFinder.searchForStops(directionsData, flavortown, 10, 'mi');
    }
  }, {
    key: 'makeInfoWindow',
    value: function makeInfoWindow(location) {
      var infoWindowContent = "<div class='info-window'>";
      infoWindowContent += '<h1>Embassy to Flavortown:</h1>';
      infoWindowContent += '<h2>' + location.title + '</h2>';
      infoWindowContent += '<p>' + location.formattedAddress + '</p>';
      infoWindowContent += '<a target=\'_blank\' href=\'' + location.website + '\'>website</a>';
      infoWindowContent += '</div>';

      return this.mapHandler.createInfoWindow({ content: infoWindowContent });
    }
  }, {
    key: 'addLocationToMap',
    value: function addLocationToMap(location) {
      var _this = this;

      var newInfoWindow = this.makeInfoWindow(location);
      var markerPosition = {
        lat: +location.address.lat,
        lng: +location.address.lng
      };
      var newMarker = this.mapHandler.createMarker({
        position: markerPosition,
        title: location.title
      });
      newMarker.addListener('click', function () {
        _this.infoWindows.map(function (infoWindow) {
          return infoWindow.close();
        });
        newInfoWindow.open(_this.mapHandler.instance, newMarker);
      });
      this.infoWindows.push(newInfoWindow);
      this.markers.push(newMarker);
    }
  }, {
    key: 'updateMap',
    value: function updateMap() {
      var _this2 = this;

      this.clearMapData();

      var formData = this.formHandler.getInfoFromForm();
      if (!formData.startingLocation.length || !formData.endingLocation.length) {
        return;
      }

      this.mapHandler.fetchDirections(formData.startingLocation, formData.endingLocation).then(function (response) {
        _this2.mapHandler.directionsDisplay.setDirections(response);
        var suggestedStops = _this2.searchForStops(response);
        suggestedStops.map(function (location) {
          return _this2.addLocationToMap(location);
        });
      }, function (err) {
        throw new Error('fetching directions failed with status: ' + err);
      });
    }
  }]);

  return FoodMap;
}();

module.exports = FoodMap;

},{"./FormHandler.js":2,"./MapHandler.js":3,"./PathFinder":4,"./confirmArrival.js":5}],2:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* global document */

var FormHandler = function () {
  function FormHandler(selector) {
    _classCallCheck(this, FormHandler);

    this.$el = document.getElementById(selector);
  }

  _createClass(FormHandler, [{
    key: "disableBtnDefault",
    value: function disableBtnDefault(type) {
      this.$el.addEventListener(type, function (event) {
        event.preventDefault();
      });
    }
  }, {
    key: "getInfoFromForm",
    value: function getInfoFromForm() {
      var formElements = this.$el.elements;
      return {
        startingLocation: formElements[0].value,
        endingLocation: formElements[1].value
      };
    }
  }]);

  return FormHandler;
}();

module.exports = FormHandler;

},{}],3:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* global window, document */

var MapHandler = function () {
  function MapHandler(google, elementId) {
    _classCallCheck(this, MapHandler);

    this.google = google;
    this.setMapEls(elementId);
    this.directionsService = new this.google.maps.DirectionsService();
    this.directionsDisplay = new this.google.maps.DirectionsRenderer();
  }

  _createClass(MapHandler, [{
    key: "setMapEls",
    value: function setMapEls(elementId) {
      this.$map = document.getElementById(elementId);
    }
  }, {
    key: "setOnResizeListener",
    value: function setOnResizeListener() {
      window.onresize = this.resizeMapElement.apply(this);
    }
  }, {
    key: "resizeMapElement",
    value: function resizeMapElement() {
      var mapHeight = window.innerHeight - this.$map.getBoundingClientRect().top - 40;
      this.$map.style.height = mapHeight + "px";
    }
  }, {
    key: "createMarker",
    value: function createMarker(options) {
      options.map = this.instance;
      return new this.google.maps.Marker(options);
    }
  }, {
    key: "createInfoWindow",
    value: function createInfoWindow(options) {
      return new this.google.maps.InfoWindow(options);
    }
  }, {
    key: "initMap",
    value: function initMap(options) {
      var mapOptions = {
        mapTypeId: this.google.maps.MapTypeId[options.mapType],
        center: { lat: options.lat, lng: options.lng },
        scrollwheel: false,
        zoom: 8
      };

      this.instance = new this.google.maps.Map(this.$map, mapOptions);
      this.directionsDisplay.setMap(this.instance);
    }
  }, {
    key: "makeDirections",
    value: function makeDirections(startingLocation, endingLocation, callback) {
      var request = {
        origin: startingLocation,
        destination: endingLocation,
        provideRouteAlternatives: true,
        travelMode: this.google.maps.DirectionsTravelMode.DRIVING
      };

      return this.directionsService.route(request, callback);
    }
  }, {
    key: "fetchDirections",
    value: function fetchDirections(startingLocation, endingLocation) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        _this.makeDirections(startingLocation, endingLocation, function (response, status) {
          if (status === _this.google.maps.DirectionsStatus.OK) {
            resolve(response);
          } else {
            reject(status);
          }
        });
      });
    }
  }]);

  return MapHandler;
}();

module.exports = MapHandler;

},{}],4:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var haversine = require('haversine');

var _require = require('./helpers.js'),
    getPointFrequency = _require.getPointFrequency;

var PathFinder = function () {
  function PathFinder() {
    _classCallCheck(this, PathFinder);
  }

  _createClass(PathFinder, [{
    key: 'getClosestLocation',
    value: function getClosestLocation(pathPoint, dataPoints) {
      var _this = this;

      var result = dataPoints.reduce(function (_ref, location) {
        var minDistance = _ref.minDistance,
            minDistanceLocation = _ref.minDistanceLocation;

        var locationLatLng = {
          latitude: +location.address.lat,
          longitude: +location.address.lng
        };
        var distance = haversine(pathPoint, locationLatLng, { unit: _this.units });
        if (minDistance === undefined || minDistance > distance) {
          minDistance = distance;
          minDistanceLocation = location;
        }
        return { minDistance: minDistance, minDistanceLocation: minDistanceLocation };
      }, {});
      return result.minDistanceLocation;
    }
  }, {
    key: 'searchForStops',
    value: function searchForStops(directionsData, dataPoints, frequency, units) {
      var drivingPath = directionsData.routes[0].overview_path;

      var checkEvery = getPointFrequency(frequency, units, drivingPath);
      var count = checkEvery;
      var result = [];

      while (count < drivingPath.length) {
        var pathPoint = {
          latitude: drivingPath[count].lat(),
          longitude: drivingPath[count].lng()
        };

        var minDistanceLocation = this.getClosestLocation(pathPoint, dataPoints);
        result.push(minDistanceLocation);
        count += checkEvery;
      }
      return result;
    }
  }]);

  return PathFinder;
}();

module.exports = PathFinder;

},{"./helpers.js":6,"haversine":8}],5:[function(require,module,exports){
"use strict";

var asyncScripts = {};

var confirmArrival = function confirmArrival(asset) {
  if (asset != null) {
    asyncScripts[asset] = true;
  }
  return asyncScripts;
};

module.exports = confirmArrival;

},{}],6:[function(require,module,exports){
"use strict";

var getHalfwayPoint = function getHalfwayPoint(directionsData) {
  var overviewPath = directionsData.routes[0].overview_path;
  var pathHalfwayPoint = Math.floor(overviewPath.length / 2);
  return {
    latitude: overviewPath[pathHalfwayPoint].lat(),
    longitude: overviewPath[pathHalfwayPoint].lng()
  };
};

var getPointFrequency = function getPointFrequency(frequency, units, path) {
  var checkEvery = frequency;
  while (checkEvery * frequency / path.length > frequency) {
    checkEvery *= frequency;
  }
  return checkEvery;
};

module.exports = { getHalfwayPoint: getHalfwayPoint, getPointFrequency: getPointFrequency };

},{}],7:[function(require,module,exports){
'use strict';

/* global window */

window.confirmArrival = require('./confirmArrival.js');
var FoodMap = require('./FoodMap.js');

window.initMap = function () {
  window.FoodMap = new FoodMap(window.google);
};

},{"./FoodMap.js":1,"./confirmArrival.js":5}],8:[function(require,module,exports){
var haversine = (function () {
  var RADII = {
    km:    6371,
    mile:  3960,
    meter: 6371000,
    nmi:   3440
  }

  // convert to radians
  var toRad = function (num) {
    return num * Math.PI / 180
  }

  // convert coordinates to standard format based on the passed format option
  var convertCoordinates = function (format, coordinates) {
    switch (format) {
    case '[lat,lon]':
      return { latitude: coordinates[0], longitude: coordinates[1] }
    case '[lon,lat]':
      return { latitude: coordinates[1], longitude: coordinates[0] }
    case '{lon,lat}':
      return { latitude: coordinates.lat, longitude: coordinates.lon }
    case 'geojson':
      return { latitude: coordinates.geometry.coordinates[1], longitude: coordinates.geometry.coordinates[0] }
    default:
      return coordinates
    }
  }

  return function haversine (startCoordinates, endCoordinates, options) {
    options   = options || {}

    var R = options.unit in RADII
      ? RADII[options.unit]
      : RADII.km

    var start = convertCoordinates(options.format, startCoordinates)
    var end = convertCoordinates(options.format, endCoordinates)

    var dLat = toRad(end.latitude - start.latitude)
    var dLon = toRad(end.longitude - start.longitude)
    var lat1 = toRad(start.latitude)
    var lat2 = toRad(end.latitude)

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2)
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))

    if (options.threshold) {
      return options.threshold > (R * c)
    }

    return R * c
  }

})()

if (typeof module !== 'undefined' && module.exports) {
  module.exports = haversine
}

},{}]},{},[7]);
