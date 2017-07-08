const getHalfwayPoint = (directionsData) => {
  const overviewPath = directionsData.routes[0].overview_path;
  const pathHalfwayPoint = Math.floor(overviewPath.length / 2);
  return {
    latitude: overviewPath[pathHalfwayPoint].lat(),
    longitude: overviewPath[pathHalfwayPoint].lng(),
  };
};

const getPointFrequency = (frequency, units, path) => {
  let checkEvery = frequency;
  while (((checkEvery * frequency) / path.length) > frequency) {
    checkEvery *= frequency;
  }
  return checkEvery;
};

module.exports = { getHalfwayPoint, getPointFrequency };
