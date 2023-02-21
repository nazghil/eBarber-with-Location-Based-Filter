var express = require("express");
var bcrypt = require("bcryptjs");
var router = express.Router();
let alert = require("alert");

const {default: mongoose} = require("mongoose");
var {BarbershopInfo} = require("../../models/barbershop_info");
const {append} = require("express/lib/response");
let {session} = require("passport");
const { restart } = require("nodemon");
//TODO:: add in error and info 

router.post("/register",async function(req,res,next){
    if (
        !req.body.email ||
        !req.body.password ||
        !req.body.barbershopName ||
        !req.body.barbershopContact ||
        !req.body.barbershopAddress ||
        !req.body.barbershopState
    ) {
        alert("Fill in all detail required");
    } else {
        BarbershopInfo.findOne({ email: req.body.email }).then((barbershop) => {
            if (barbershop) {
                alert("Email already registered");
            } else {
                // if (req.body.password != req.body.password2) {
                //     alert("Wrong password input");
                // } else {
                    const data = new BarbershopInfo({
                        email: req.body.email,
                        password: req.body.password,
                        barbershopName: req.body.barbershopName,
                        barbershopContact: req.body.barbershopContact,
                        barbershopAddress: req.body.barbershopAddress,
                        barbershopState: req.body.barbershopState,
                        long: req.body.long,
                        lat: req.body.lat,
                        description: "",
                        price: "",
                    });
                    data.save().then(() => {
                        res.render("barbershops/register");
                    }).catch((err) => console.log(err));
                // }
            }
        });
    }
});

router.post("/login", function (req, res, next) {
	console.log(req.body);
	BarbershopInfo.findOne({ email: req.body.email }, function (err, data) {
		if (data) {
			bcrypt
				.compare(req.body.psw, data.password)
				.then((doMatch) => {
					if (doMatch) {
						req.session.email = data.email;
						session = req.session;
						console.log(session);
						res.render("barbershops/home",{session});
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

router.post("/updateprofile", function (req, res, next) {
    var update = {
        barbershopName: req.body.barbershopName,
        email: req.body.email,
        description: req.body.description,
        price: req.body.price,
    };
    BarbershopInfo.findOneAndUpdate({ email: req.session.email }, update)
        .then(() => {
            BarbershopInfo.find({}, function (err, data) {
                if (data){
                    alert("Update Success");
                    res.redirect("/barbershops/profile");
                }
            });
        })
        .catch((err) => console.log(err));
});

module.exports = router;