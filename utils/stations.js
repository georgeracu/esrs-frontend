const stationsAndCodesJson = require('../resources/stations_and_codes');
const stationsAndCodes = new Map();
stationsAndCodesJson.forEach(stationAndCode => {
  stationsAndCodes.set(stationAndCode.key, stationAndCode.value);
});
const names = Array.from(stationsAndCodes.keys());
const codes = Array.from(stationsAndCodes.values());

export const stations = {
  names,
  codes,
  stationsAndCodes,
};
