const haversine = require('haversine');

class PathFinder {
  constructor() {
  }

  getPointFrequency(frequency, units, path) {
    let checkEvery = frequency;
    while ((checkEvery * frequency / path.length) > frequency) {
      checkEvery *= frequency;
    }
    return checkEvery;
  }

  getClosestLocation(pathPoint, dataPoints) {
    let distance = 0;
    let minDistance,
      minDistanceLocation;

    for (let i = 0; i < dataPoints.length; i++) {
      const location = dataPoints[i];
      const locationLatLng = {
        latitude: +location.address.lat,
        longitude: +location.address.lng,
      };
      distance = haversine(pathPoint, locationLatLng, { unit: this.units });
      if (minDistance === undefined || minDistance > distance) {
        minDistance = distance;
        minDistanceLocation = location;
      }
    }
    return minDistanceLocation;
  }

  searchForStops(directionsData, dataPoints, frequency, units) {
    const drivingPath = directionsData.routes[0].overview_path;

    const checkEvery = this.getPointFrequency(frequency, units, drivingPath);
    let count = checkEvery;
    const result = [];

    while (count < drivingPath.length) {
      const pathPoint = {
        latitude: drivingPath[count].lat(),
        longitude: drivingPath[count].lng(),
      };

      const minDistanceLocation = this.getClosestLocation(pathPoint, dataPoints);
      result.push(minDistanceLocation);
      count += checkEvery;
    }
    return result;
  }
}

module.exports = PathFinder;
