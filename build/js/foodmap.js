(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var asyncScripts = {};

var confirmArrival = function confirmArrival(asset) {
  if (asset != null) {
    asyncScripts[asset] = true;
  }
  return asyncScripts;
};

module.exports = confirmArrival;

},{}],2:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var haversine = require('haversine');
var confirmArrival = require('./confirmArrival.js');

window.confirmArrival = confirmArrival;

var FoodMap = void 0;

function _initMapForm() {
  document.getElementById('map-form').addEventListener('‌​submit', function (event) {
    event.preventDefault();
  });
}

function resizeMapElement() {
  var mapHeight = window.innerHeight - document.getElementById('map').getBoundingClientRect().top - 40;
  document.getElementById('map').style.height = mapHeight + 'px';
}

function getInfoFromForm() {
  var formElements = document.getElementById('map-form').elements;
  return {
    startingLocation: formElements[0].value,
    endingLocation: formElements[1].value
  };
}

function addLocationToMap(location) {
  if ((typeof FoodMap === 'undefined' ? 'undefined' : _typeof(FoodMap)) === undefined) {
    return;
  }

  var infoWindowContent = "<div class='info-window'>";
  infoWindowContent += '<h1>Embassy to Flavortown:</h1>';
  infoWindowContent += '<h2>' + location.title + '</h2>';
  infoWindowContent += '<p>' + location.formattedAddress + '</p>';
  infoWindowContent += '<a target=\'_blank\' href=\'' + location.website + '\'>website</a>';
  infoWindowContent += '</div>';

  var infoWindow = new google.maps.InfoWindow({
    content: infoWindowContent
  });

  var markerPosition = {
    lat: +location.address.lat,
    lng: +location.address.lng
  };

  var marker = new google.maps.Marker({
    position: markerPosition,
    title: location.title,
    map: FoodMap.googleMap
  });

  marker.addListener('click', function () {
    FoodMap.infoWindows.map(function (infoWindow) {
      infoWindow.close();
    });
    infoWindow.open(FoodMap.googleMap, marker);
  });
  FoodMap.infoWindows.push(infoWindow);
  FoodMap.markers.push(marker);
}

function makeDirections(startingLocation, endingLocation, callback) {
  if ((typeof FoodMap === 'undefined' ? 'undefined' : _typeof(FoodMap)) === undefined) {
    return;
  }

  var request = {
    origin: startingLocation,
    destination: endingLocation,
    provideRouteAlternatives: true,
    travelMode: google.maps.DirectionsTravelMode.DRIVING
  };

  return FoodMap.directionsService.route(request, callback);
}

function getHalfwayPoint(mapResponse) {
  var overview_path = mapResponse.routes[0].overview_path;
  var path_halfway_point = Math.floor(overview_path.length / 2);
  var midpoint = {
    latitude: overview_path[path_halfway_point].lat(),
    longitude: overview_path[path_halfway_point].lng()
  };

  return midpoint;
}

function searchForStops(mapResponse) {
  var drivingPath = mapResponse.routes[0].overview_path;
  var flavortown = window.flavortown;
  if (confirmArrival().flavortown != true || !flavortown) {
    throw new Error('flavortown assets have not loaded');
  }
  if ((typeof haversine === 'undefined' ? 'undefined' : _typeof(haversine)) === undefined) {
    throw new Error('haversine module was not loaded');
  }

  var checkEvery = 10;
  while (checkEvery * 10 / drivingPath.length > 10) {
    checkEvery *= 10;
  }

  var count = checkEvery;
  var result = [];
  while (count < drivingPath.length) {
    var pathPoint = {
      latitude: drivingPath[count].lat(),
      longitude: drivingPath[count].lng()
    };
    var distance = 0;
    var minDistance = minDistanceLocation = undefined;
    for (var i = 0; i < flavortown.length; i++) {
      var location = flavortown[i];
      var locationLatLng = {
        latitude: +location.address.lat,
        longitude: +location.address.lng
      };
      distance = haversine(pathPoint, locationLatLng, { unit: 'mile' });
      if (minDistance === undefined || minDistance > distance) {
        minDistance = distance;
        minDistanceLocation = location;
      }
    }
    result.push(minDistanceLocation);
    count += checkEvery;
  }
  return result;
}

function addAllLocations() {
  for (var i = 0; i < flavortown.length; i++) {
    var location = flavortown[i];
    var markerPosition = {
      lat: +location.address.lat,
      lng: +location.address.lng
    };

    var marker = new google.maps.Marker({
      position: markerPosition,
      title: location.title,
      map: FoodMap.googleMap
    });
  }
}

window.initMap = function () {
  FoodMap = {};
  FoodMap.directionsService = new google.maps.DirectionsService();
  FoodMap.directionsDisplay = new google.maps.DirectionsRenderer();
  FoodMap.infoWindows = [];
  FoodMap.markers = [];

  resizeMapElement();
  window.onresize = resizeMapElement;

  var map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 41.8781, lng: -87.6298 },
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    scrollwheel: false,
    zoom: 8
  });
  FoodMap.directionsDisplay.setMap(map);
  FoodMap.googleMap = map;

  _initMapForm();
};

window.updateMap = function () {
  FoodMap.markers.map(function (marker) {
    marker.setMap(null);
  });
  FoodMap.infoWindows = [];
  FoodMap.markers = [];

  if ((typeof FoodMap === 'undefined' ? 'undefined' : _typeof(FoodMap)) === undefined) {
    return;
  }

  formData = getInfoFromForm();

  if (!formData.startingLocation.length || !formData.endingLocation.length) {
    return;
  }

  var navigator = new Promise(function (resolve, reject) {
    makeDirections(formData.startingLocation, formData.endingLocation, function (response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        FoodMap.directionsDisplay.setDirections(response);
        resolve(response);
      } else {
        reject(status);
      }
    });
  });

  navigator.then(function (response) {
    var suggestedStops = searchForStops(response);
    for (var i = 0; i < suggestedStops.length; i++) {
      addLocationToMap(suggestedStops[i]);
    }
  }, function (err) {
    throw new Error('fetching directions failed with status: ' + status);
  });
};

},{"./confirmArrival.js":1,"haversine":3}],3:[function(require,module,exports){
var haversine = (function () {

  // convert to radians
  var toRad = function (num) {
    return num * Math.PI / 180
  }

  return function haversine (start, end, options) {
    options   = options || {}

    var radii = {
      km:    6371,
      mile:  3960,
      meter: 6371000,
      nmi:   3440
    }

    var R = options.unit in radii
      ? radii[options.unit]
      : radii.km

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

},{}]},{},[2]);
