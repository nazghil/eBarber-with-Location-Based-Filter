var express = require("express");
var bcrypt = require("bcryptjs");
var router = express.Router();
let alert = require("alert");

const {default: mongoose} = require("mongoose");
var {BarbershopInfo, AdminInfo} = require("../../models/admin_info");
const {append} = require("express/lib/response");
let {session} = require("passport");
const { restart } = require("nodemon");
//TODO:: add in error and info 

//register
router.post("/register",async function(req,res,next){
    if (
		!req.body.email ||
        !req.body.password 

    ) {
        alert("Fill in all detail required");
    } else {
        AdminInfo.findOne({ email: req.body.email }).then((admin) => {
            if (admin) {
                alert("Email already registered");
            } else {
                // if (req.body.password != req.body.password2) {
                //     alert("Wrong password input");
                // } else {
                    const data = new AdminInfo({
						email: req.body.email,
                        password: req.body.password,
                    });
                    data.save().then(() => {
                        res.render("admin/login");
                    }).catch((err) => console.log(err));
                // }
            }
        });
    }
});

//login
router.post("/login", function (req, res, next) {
	console.log(req.body);
	AdminInfo.findOne({ email: req.body.email }, function (err, data) {
		if (data) {
			bcrypt
				.compare(req.body.psw, data.password)
				.then((doMatch) => {
					if (doMatch) {
						req.session.email = data.email;
						session = req.session;
						console.log(session);
						res.render("admin/home",{session});
					} else {
						alert("Wrong password input");
					}
				})
				.catch((err) => {
					console.log(err);
				});
		} else {
			alert("Email and Password does not matched");
		}
	});
});

module.exports = router;