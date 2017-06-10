const asyncScripts = {};

function confirmArrival(asset) {
  if (asset != null) {
    asyncScripts[asset] = true;
  }
  return asyncScripts;
}

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

let FoodMap;

function _initMapForm() {
  document.getElementById('map-form').addEventListener('‌​submit', (event) => { event.preventDefault(); });
}

function resizeMapElement() {
  const mapHeight = window.innerHeight - document.getElementById('map').getBoundingClientRect().top - 40;
  document.getElementById('map').style.height = `${mapHeight}px`;
}

function initMap() {
  FoodMap = {};
  FoodMap.directionsService = new google.maps.DirectionsService();
  FoodMap.directionsDisplay = new google.maps.DirectionsRenderer();
  FoodMap.infoWindows = [];
  FoodMap.markers = [];

  resizeMapElement();
  window.onresize = resizeMapElement;

  const map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 41.8781, lng: -87.6298 },
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    scrollwheel: false,
    zoom: 8,
  });
  FoodMap.directionsDisplay.setMap(map);
  FoodMap.googleMap = map;

  _initMapForm();
}

function getInfoFromForm() {
  const formElements = document.getElementById('map-form').elements;
  return {
    startingLocation: formElements[0].value,
    endingLocation: formElements[1].value,
  };
}

function updateMap() {
  FoodMap.markers.map((marker) => {
    marker.setMap(null);
  });
  FoodMap.infoWindows = [];
  FoodMap.markers = [];

  if ((typeof FoodMap === undefined)) {
    return;
  }

  formData = getInfoFromForm();

  if (!formData.startingLocation.length || !formData.endingLocation.length) {
    return;
  }

  const navigator = new Promise((resolve, reject) => {
    makeDirections(formData.startingLocation, formData.endingLocation, (response, status) => {
      if (status == google.maps.DirectionsStatus.OK) {
        FoodMap.directionsDisplay.setDirections(response);
        resolve(response);
      } else {
        reject(status);
      }
    });
  });

  navigator.then((response) => {
    const suggestedStops = searchForStops(response);
    for (let i = 0; i < suggestedStops.length; i++) {
      addLocationToMap(suggestedStops[i]);
    }
  }, (err) => {
    throw new Error(`fetching directions failed with status: ${status}`);
  });
}

function addLocationToMap(location) {
  if ((typeof FoodMap === undefined)) {
    return;
  }

  let infoWindowContent = "<div class='info-window'>";
  infoWindowContent += '<h1>Embassy to Flavortown:</h1>';
  infoWindowContent += `<h2>${location.title}</h2>`;
  infoWindowContent += `<p>${location.formattedAddress}</p>`;
  infoWindowContent += `<a target='_blank' href='${location.website}'>website</a>`;
  infoWindowContent += '</div>';

  const infoWindow = new google.maps.InfoWindow({
    content: infoWindowContent,
  });

  const markerPosition = {
    lat: +location.address.lat,
    lng: +location.address.lng,
  };

  const marker = new google.maps.Marker({
    position: markerPosition,
    title: location.title,
    map: FoodMap.googleMap,
  });

  marker.addListener('click', () => {
    FoodMap.infoWindows.map((infoWindow) => {
      infoWindow.close();
    });
    infoWindow.open(FoodMap.googleMap, marker);
  });
  FoodMap.infoWindows.push(infoWindow);
  FoodMap.markers.push(marker);
}

function makeDirections(startingLocation, endingLocation, callback) {
  if ((typeof FoodMap === undefined)) {
    return;
  }

  const request = {
    origin: startingLocation,
    destination: endingLocation,
    provideRouteAlternatives: true,
    travelMode: google.maps.DirectionsTravelMode.DRIVING,
  };

  return FoodMap.directionsService.route(request, callback);
}

function getHalfwayPoint(mapResponse) {
  const overview_path = mapResponse.routes[0].overview_path;
  const path_halfway_point = Math.floor(overview_path.length / 2);
  const midpoint = {
    latitude: overview_path[path_halfway_point].lat(),
    longitude: overview_path[path_halfway_point].lng(),
  };

  return midpoint;
}

function searchForStops(mapResponse) {
  const drivingPath = mapResponse.routes[0].overview_path;

  if ((confirmArrival().flavortown != true) || (!flavortown)) {
    throw new Error('flavortown assets have not loaded');
  }
  if (typeof haversine === undefined) {
    throw new Error('haversine module was not loaded');
  }

  let checkEvery = 10;
  while ((checkEvery * 10 / drivingPath.length) > 10) {
    checkEvery *= 10;
  }

  let count = checkEvery;
  const result = [];
  while (count < drivingPath.length) {
    const pathPoint = {
      latitude: drivingPath[count].lat(),
      longitude: drivingPath[count].lng(),
    };
    let distance = 0;
    let minDistance = minDistanceLocation = undefined;
    for (let i = 0; i < flavortown.length; i++) {
      const location = flavortown[i];
      const locationLatLng = {
        latitude: +location.address.lat,
        longitude: +location.address.lng,
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
  for (let i = 0; i < flavortown.length; i++) {
    const location = flavortown[i];
    const markerPosition = {
      lat: +location.address.lat,
      lng: +location.address.lng,
    };

    const marker = new google.maps.Marker({
      position: markerPosition,
      title: location.title,
      map: FoodMap.googleMap,
    });
  }
}
