var express = require("express");
var router = express.Router();
const {
  getVendors,
  addVendor,
  login,
  changeStatus
} = require("../services/VendorService");

router.route("/get").get(async function(req, res, next) {
  const result = await getVendors();
  res.statusCode = result.statusCode;
  res.send(result.response);
});

router.route("/").post(async function(req, res, next) {
  const result = await addVendor(req.body);
  res.statusCode = result.statusCode;
  res.send(result.response);
});

router.route("/login").post(async function(req, res, next) {
  const result = await login(req.body);
  res.statusCode = result.statusCode;
  res.send(result.response);
});

router.route("/status/:vendorId").put(async function(req, res, next) {
  const result = await changeStatus(req.body, req.params.vendorId);
  res.statusCode = result.statusCode;
  res.send(result.response);
});

module.exports = router;
