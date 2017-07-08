const MapHandler = require('./MapHandler.js');
const FormHandler = require('./FormHandler.js');
const PathFinder = require('./PathFinder');

window.confirmArrival = require('./confirmArrival.js');

class FoodMap {
  constructor(google) {
    this.infoWindows = [];
    this.markers = [];

    this.mapHandler = new MapHandler(google, 'map');
    this.initGoogleMaps();
    this.mapHandler.setOnResizeListener();

    this.formHandler = new FormHandler('map-form');
    this.formHandler.disableBtnDefault('submit');

    this.pathFinder = new PathFinder();
  }

  initGoogleMaps() {
    this.mapHandler.initMap({
      center: { lat: 41.8781, lng: -87.6298 },
      mapType: 'ROADMAP',
      scrollwheel: false,
      zoom: 8,
    });
  }

  clearMapData() {
    this.markers.map((marker) => {
      marker.setMap(null);
    });
    this.infoWindows = [];
    this.markers = [];
  }

  getFlavorTownData() {
    if ((confirmArrival().flavortown != true) || (!window.flavortown)) {
      throw new Error('flavortown assets have not loaded');
    } else {
      return window.flavortown;
    }
  }

  searchForStops(directionsData) {
    const flavortown = this.getFlavorTownData();
    return this.pathFinder.searchForStops(directionsData, flavortown, 10, 'mi');
  }

  makeInfoWindow(location) {
    let infoWindowContent = "<div class='info-window'>";
    infoWindowContent += '<h1>Embassy to Flavortown:</h1>';
    infoWindowContent += `<h2>${location.title}</h2>`;
    infoWindowContent += `<p>${location.formattedAddress}</p>`;
    infoWindowContent += `<a target='_blank' href='${location.website}'>website</a>`;
    infoWindowContent += '</div>';

    return this.mapHandler.createInfoWindow({ content: infoWindowContent });
  }

  addLocationToMap(location) {
    const newInfoWindow = this.makeInfoWindow(location);
    const markerPosition = {
      lat: +location.address.lat,
      lng: +location.address.lng,
    };
    const newMarker = this.mapHandler.createMarker({
      position: markerPosition,
      title: location.title,
    });
    newMarker.addListener('click', () => {
      this.infoWindows.map((infoWindow) => {
        infoWindow.close();
      });
      newInfoWindow.open(this.mapHandler.instance, newMarker);
    });
    this.infoWindows.push(newInfoWindow);
    this.markers.push(newMarker);
  }

  updateMap() {
    this.clearMapData();

    const formData = this.formHandler.getInfoFromForm();
    if (!formData.startingLocation.length || !formData.endingLocation.length) {
      return;
    }

    this.mapHandler.fetchDirections(formData.startingLocation, formData.endingLocation)
        .then(
            (response) => {
              this.mapHandler.directionsDisplay.setDirections(response);
              const suggestedStops = this.searchForStops(response);
              for (let i = 0; i < suggestedStops.length; i++) {
                this.addLocationToMap(suggestedStops[i]);
              }
            }, (err) => {
              throw new Error(`fetching directions failed with status: ${status}`);
            },
        );
  }
}

module.exports = FoodMap;
