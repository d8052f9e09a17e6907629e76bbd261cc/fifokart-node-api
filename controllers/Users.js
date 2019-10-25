var express = require("express");
var router = express.Router();
const {
  getUsers,
  addUser,
  login,
  addAddress,
  getAddress,
  deleteAddress
} = require("../services/UsersService");

router.route("/get").get(async function(req, res, next) {
  const result = await getUsers();
  res.statusCode = result.statusCode;
  res.send(result.response);
});

router.route("/").post(async function(req, res, next) {
  const result = await addUser(req.body);
  res.statusCode = result.statusCode;
  res.send(result.response);
});

router.route("/login").post(async function(req, res, next) {
  const result = await login(req.body);
  res.statusCode = result.statusCode;
  res.send(result.response);
});

router.route("/address/:userId").post(async function(req, res, next) {
  const result = await addAddress(req.body, req.params.userId);
  res.statusCode = result.statusCode;
  res.send(result.response);
});

router.route("/address/:userId").get(async function(req, res, next) {
  const result = await getAddress(req.params.userId);
  res.statusCode = result.statusCode;
  res.send(result.response);
});

router.route("/address/:addressId").delete(async function(req, res, next) {
  const result = await deleteAddress(req.params.addressId);
  res.statusCode = result.statusCode;
  res.send(result.response);
});

module.exports = router;
