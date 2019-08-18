var express = require('express');
var router = express.Router();
const {
  getProducts,
  addProduct,
  getById,
  changeStatus,
  editProduct,
} = require('../services/ProductService');

router.route('/get/:vendorId').get(async function(req, res, next) {
  const result = await getProducts(req.params.vendorId);
  res.statusCode = result.statusCode;
  res.send(result.response);
});

router.route('/:vendorId').post(async function(req, res, next) {
  const result = await addProduct(req.body, req.params.vendorId);
  res.statusCode = result.statusCode;
  res.send(result.response);
});

router.route('/:productId').get(async function(req, res, next) {
  const result = await getById(req.params.productId);
  res.statusCode = result.statusCode;
  res.send(result.response);
});

router.route('/:productId').put(async function(req, res, next) {
  const result = await editProduct(req.body, req.params.productId);
  res.statusCode = result.statusCode;
  res.send(result.response);
});

router.route('/status/:productId').put(async function(req, res, next) {
  const result = await changeStatus(req.body, req.params.productId);
  res.statusCode = result.statusCode;
  res.send(result.response);
});

module.exports = router;
