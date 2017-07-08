const haversine = require('haversine');
const { getPointFrequency } = require('./helpers.js');

class PathFinder {
  getClosestLocation(pathPoint, dataPoints) {
    const result = dataPoints.reduce(
      ({ minDistance, minDistanceLocation }, location) => {
        const locationLatLng = {
          latitude: +location.address.lat,
          longitude: +location.address.lng,
        };
        const distance = haversine(pathPoint, locationLatLng, { unit: this.units });
        if (minDistance === undefined || minDistance > distance) {
          minDistance = distance;
          minDistanceLocation = location;
        }
        return { minDistance, minDistanceLocation };
      },
    {});
    return result.minDistanceLocation;
  }

  searchForStops(directionsData, dataPoints, frequency, units) {
    const drivingPath = directionsData.routes[0].overview_path;

    const checkEvery = getPointFrequency(frequency, units, drivingPath);
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
