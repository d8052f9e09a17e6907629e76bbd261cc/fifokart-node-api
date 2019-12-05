var express = require("express");
var router = express.Router();
var { getNearByPlaces } = require("../services/MapService");

router.route("/place").get(async function(req, res, next) {
  const { text, lat, lng, radius, key } = req.query;
  const result = await getNearByPlaces(text, lat, lng, radius, key);
  res.send(result);
});

module.exports = router;
