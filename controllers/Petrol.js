var express = require("express");
var router = express.Router();
var {
  getList,
  addPetrolInList,
  editPetrolInList,
  editPetrolInList
} = require("../services/PetrolService");

router.route("/:deviceId").get(async function(req, res, next) {
  const result = await getList(req.params.deviceId);
  res.statusCode = result.statusCode;
  res.send(result.response);
});

router.route("/:deviceId").post(async function(req, res, next) {
  const result = await addPetrolInList(req.body, req.params.deviceId);
  res.statusCode = result.statusCode;
  res.send(result.response);
});

router.route("/:uniqueId").put(async function(req, res, next) {
  const result = await editPetrolInList(req.body, req.params.uniqueId);
  res.statusCode = result.statusCode;
  res.send(result.response);
});

module.exports = router;
