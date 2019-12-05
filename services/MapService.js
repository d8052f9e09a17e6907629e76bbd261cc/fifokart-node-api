var request = require("request");
const { API_KEY } = require("../config/databaseConfig");

function getNearByPlaces(text, lat, lng, radius, key) {
  return new Promise(function(resolve, reject) {
    request(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${text}&location=${lat},${lng}&radius=${radius}&key=${key}`,
      function(error, response, body) {
        if (!error && response.statusCode == 200) {
          resolve(body);
        } else {
          reject(error);
        }
      }
    );
  });
}

module.exports = { getNearByPlaces };
