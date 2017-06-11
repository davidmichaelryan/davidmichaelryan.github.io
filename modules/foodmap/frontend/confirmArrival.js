const asyncScripts = {};

const confirmArrival = (asset) => {
  if (asset != null) {
    asyncScripts[asset] = true;
  }
  return asyncScripts;
};

module.exports = confirmArrival;
