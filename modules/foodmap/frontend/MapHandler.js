/* global window, document */

class MapHandler {
  constructor(google, elementId) {
    this.google = google;
    this.setMapEls(elementId);
    this.directionsService = new this.google.maps.DirectionsService();
    this.directionsDisplay = new this.google.maps.DirectionsRenderer();
  }

  setMapEls(elementId) {
    this.$map = document.getElementById(elementId);
  }

  setOnResizeListener() {
    window.onresize = this.resizeMapElement.apply(this);
  }

  resizeMapElement() {
    const mapHeight = window.innerHeight - this.$map.getBoundingClientRect().top - 40;
    this.$map.style.height = `${mapHeight}px`;
  }

  createMarker(options) {
    options.map = this.instance;
    return new this.google.maps.Marker(options);
  }

  createInfoWindow(options) {
    return new this.google.maps.InfoWindow(options);
  }

  initMap(options) {
    const mapOptions = {
      mapTypeId: this.google.maps.MapTypeId[options.mapType],
      center: { lat: options.lat, lng: options.lng },
      scrollwheel: false,
      zoom: 8,
    };

    this.instance = new this.google.maps.Map(this.$map, mapOptions);
    this.directionsDisplay.setMap(this.instance);
  }

  makeDirections(startingLocation, endingLocation, callback) {
    const request = {
      origin: startingLocation,
      destination: endingLocation,
      provideRouteAlternatives: true,
      travelMode: this.google.maps.DirectionsTravelMode.DRIVING,
    };

    return this.directionsService.route(request, callback);
  }

  fetchDirections(startingLocation, endingLocation) {
    return new Promise((resolve, reject) => {
      this.makeDirections(startingLocation, endingLocation, (response, status) => {
        if (status === this.google.maps.DirectionsStatus.OK) {
          resolve(response);
        } else {
          reject(status);
        }
      });
    });
  }
}

module.exports = MapHandler;
