var express = require('express');
var router = express.Router();
var userRouter = require('../controllers/Users');
var vendorRouter = require('../controllers/Vendor');
var productRouter = require('../controllers/Products');
var cartRouter = require('../controllers/Cart');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use('/user', userRouter);
router.use('/vendor', vendorRouter);
router.use('/product', cartRouter);
router.use('/cart', cartRouter);

module.exports = router;
