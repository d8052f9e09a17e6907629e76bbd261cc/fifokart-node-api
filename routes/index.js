var express = require('express');
var router = express.Router();
var userRouter = require("../controllers/Users")
var vendorRouter = require("../controllers/Vendor")

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.use("/user", userRouter);
router.use("/vendor", vendorRouter);

module.exports = router;
