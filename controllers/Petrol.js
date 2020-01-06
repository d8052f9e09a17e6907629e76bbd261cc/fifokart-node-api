var express = require("express");
var router = express.Router();
var {
  getList,
  addPetrolInList,
  editPetrolInList
} = require("../services/PetrolService");

router.route("/:loginType/:loginId").get(async function(req, res, next) {
  const result = await getList(req.params.loginType, req.params.loginId);
  res.statusCode = result.statusCode;
  res.send(result.response);
});

router.route("/:loginType").post(async function(req, res, next) {
  const result = await addPetrolInList(req.body, req.params.loginType);
  res.statusCode = result.statusCode;
  res.send(result.response);
});

router.route("/:uniqueId").put(async function(req, res, next) {
  const result = await editPetrolInList(req.body, req.params.uniqueId);
  res.statusCode = result.statusCode;
  res.send(result.response);
});

module.exports = router;
