var express = require("express");
var router = express.Router();
var userRouter = require("../controllers/Users");
var vendorRouter = require("../controllers/Vendor");
var productRouter = require("../controllers/Products");
var cartRouter = require("../controllers/Cart");
var orderRouter = require("../controllers/Orders");
var petrolRouter = require("../controllers/Petrol");
var jobRouter = require("../controllers/Job");
var mapRouter = require("../controllers/Map");

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index.html");
});

router.use("/user", userRouter);
router.use("/vendor", vendorRouter);
router.use("/product", productRouter);
router.use("/cart", cartRouter);
router.use("/order", orderRouter);
router.use("/petrol", petrolRouter);
router.use("/job", jobRouter);
router.use("/map", mapRouter);

module.exports = router;
