var express = require("express");

var router = express.Router();

//TODO:: add in error and info 

router.use("/customers", require("./customers"));

router.use("/barbershops", require("./barbershops"));

router.use("/admin", require("./admin"));

router.use("/logout", require("./logout"));



module.exports = router;