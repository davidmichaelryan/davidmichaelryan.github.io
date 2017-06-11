const asyncScripts = {};

const confirmArrival = function (asset) {
  if (asset != null) {
    asyncScripts[asset] = true;
  }
  return asyncScripts;
}

module.exports = confirmArrival;
