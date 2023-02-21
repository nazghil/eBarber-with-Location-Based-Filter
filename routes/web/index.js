var express = require("express");
var passport = require("passport");
var router = express.Router();

router.use("/customers", require("./customers"));

router.use("/barbershops", require("./barbershops"));

router.use("/admin", require("./admin"));

router.get("/", function (req, res) {
	res.render("index");
});

module.exports = router;
