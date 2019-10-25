var express = require("express");
var router = express.Router();
var userRouter = require("../controllers/Users");
var vendorRouter = require("../controllers/Vendor");
var productRouter = require("../controllers/Products");
var cartRouter = require("../controllers/Cart");
var orderRouter = require("../controllers/Orders");

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "Express" });
});

router.use("/user", userRouter);
router.use("/vendor", vendorRouter);
router.use("/product", productRouter);
router.use("/cart", cartRouter);
router.use("/order", orderRouter);

module.exports = router;
