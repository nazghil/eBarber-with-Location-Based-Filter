var express = require("express");
var bcrypt = require("bcryptjs");
var router = express.Router();
let alert = require("alert");

const {default: mongoose} = require("mongoose");
var {CustomerInfo} = require("../../models/customer_info");
const {append} = require("express/lib/response");
let {session} = require("passport");
const { restart } = require("nodemon");
//TODO:: add in error and info 

router.get("/logout", function (req, res, next) {
    console.log("logout");
    if (req.session) {
        req.session.destroy(function (err) {
            if (err) {
                return next(err);
            } else {
                return res.redirect("/");
            }
        });
    }
});

module.exports = router;