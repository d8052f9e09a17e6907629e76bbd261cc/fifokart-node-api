var express = require('express');
var router = express.Router();
const { getCart, addProductInCart } = require('../services/CartService');

router.route('/:userId').get(async function(req, res, next) {
  const result = await getCart(req.params.userId);
  res.statusCode = result.statusCode;
  res.send(result.response);
});

router.route('/:userId').post(async function(req, res, next) {
  const result = await addProductInCart(req.body, req.params.userId);
  res.statusCode = result.statusCode;
  res.send(result.response);
});

module.exports = router;
