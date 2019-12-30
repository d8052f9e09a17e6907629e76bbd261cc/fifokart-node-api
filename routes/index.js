var express = require("express");
var fs = require("fs");
var router = express.Router();
var userRouter = require("../controllers/Users");
var vendorRouter = require("../controllers/Vendor");
var productRouter = require("../controllers/Products");
var cartRouter = require("../controllers/Cart");
var orderRouter = require("../controllers/Orders");
var petrolRouter = require("../controllers/Petrol");
var jobRouter = require("../controllers/Job");
var mapRouter = require("../controllers/Map");
var md5 = require("md5");

/* GET home page. */
router.get("/:id", function(req, res, next) {
  var msg = "";
  const type = req.device.type;
  try {
    msg = JSON.parse(fs.readFileSync("./data/data.json", "utf-8"));
  } catch (e) {
    msg =
      "Wishing you a great new year 2020! I hope your life will be full of surprise and joy in the new year that's about to begin. May You be blessed with everything you want in life.";
  }

  const id = md5(msg.length + 1);
  const d = msg.filter(a => {
    return a.id === req.params.id;
  });
  const message =
    d.length > 0
      ? d[0].message
      : "Wishing you a great new year 2020! I hope your life will be full of surprise and joy in the new year that's about to begin. May You be blessed with everything you want in life.";
  const name = d.length > 0 ? d[0].name : "Mohit Prakash";
  res.render("index.ejs", {
    id,
    message,
    name,
    type,
    user: req.headers["user-agent"]
  });
});

router.post("/:id", function(req, res, next) {
  const msg = JSON.parse(fs.readFileSync("./data/data.json", "utf-8"));
  const type = req.device.type;
  msg.push({
    id: req.params.id,
    message: req.body.message,
    name: req.body.name,
    type,
    user: req.headers["user-agent"]
  });
  fs.writeFileSync("./data/data.json", JSON.stringify(msg));
  res.send("Data added successfully");
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
