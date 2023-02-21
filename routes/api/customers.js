var express = require("express");
var bcrypt = require("bcryptjs");
var router = express.Router();
let alert = require("alert");

const {default: mongoose} = require("mongoose");
var {CustomerInfo} = require("../../models/customer_info");
const {append} = require("express/lib/response");
let {session} = require("passport");
const { restart } = require("nodemon");
const { BookInfo } = require("../../models/book_info");
const { RatingInfo } = require("../../models/reviews");
const { BarbershopInfo } = require("../../models/barbershop_info");

//TODO:: add in error and info 

router.post("/register",async function(req,res,next){
    if (
        !req.body.username ||
        !req.body.fullname ||
        !req.body.password ||
        !req.body.email ||
        !req.body.contact
    ) {
        alert("Fill in all detail required");
    } else {
        CustomerInfo.findOne({ email: req.body.email }).then((customer) => {
            if (customer) {
                alert("Email already registered");
            } else {
                // if (req.body.password != req.body.password2) {
                //     alert("Wrong password input");
                // } else {
                    const data = new CustomerInfo({
                        username: req.body.username,
                        fullname: req.body.fullname,
                        password: req.body.password,
                        email: req.body.email,
                        contact: req.body.contact,
                    });
                    data.save().then(() => {
                        res.render("customers/register");
                    }).catch((err) => console.log(err));
                // }
            }
        });
    }
});

router.post("/login", function (req, res, next) {
	CustomerInfo.findOne({ email: req.body.email }, function (err, data) {
		if (data) {
			bcrypt
				.compare(req.body.psw, data.password)
				.then((doMatch) => {
					if (doMatch) {
						req.session.email = data.email;
						session = req.session;
						console.log(session);
						res.render("customers/home",{session});
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

router.post("/booking", function(req,res){
    var date1 = JSON.stringify(req.body.bookDate)
    BookInfo.findOne({emailBarber: req.body.emailB}, function(err, data){
        if(data){
            if(data.bookDate === date1){
                alert("Barber already book this date")
                res.redirect("/customers/reservation")
            }
            if(data.bookDate != date1){
                CustomerInfo.findOne({email: req.body.emailC}, function(err, data1){
                    if(data1){
                        const newBook = new BookInfo({
                            emailBarber: req.body.emailB,
                            emailCust: req.body.emailC,
                            bookTime: req.body.bookTime,
                            bookDate: date1,
                        })
                        newBook.save().then(()=>{
                            alert("Successfully book a session")
                            res.redirect("/customers/profile")
                        }).catch((err) =>{
                            console.log(err)
                            alert("Booking was not received")
                            res.redirect("/customers/reservation")
                        })
                    } else {
                        alert("There is some problem")
                        res.redirect("/customers/dashboard")
                    }
                })
            }
        } else if(!data){
            CustomerInfo.findOne({email: req.session.email}, function(err,data2){
                if(data2){
                    const newBook = new BookInfo({
                        emailBarber: req.body.emailB,
                        emailCust: req.body.emailC,
                        bookTime: req.body.bookTime,
                        bookDate: date1,
                    })
                    newBook.save().then(()=>{
                        alert("Successfully book a session")
                        res.redirect("/customers/dashboard")
                    }).catch((err) =>{
                        console.log(err)
                        alert("Booking was not received")
                        res.redirect("/customers/reservation")
                    })
                } else {
                    alert("There is some problem")
                    res.redirect("/customers/dashboard")
                }
            })
        } else {
            alert("Something went wrong")
            res.redirect("/customers/dashboard")
        }
    })
})

router.post("/updateprofile", function (req, res, next) {
    var update = {
        username: req.body.username,
        email: req.body.email,
    };
    CustomerInfo.findOneAndUpdate({ email: req.session.email }, update)
        .then(() => {
            CustomerInfo.find({}, function (err, data) {
                if (data){
                    alert("Update Success");
                    res.redirect("/customers/profile");
                }
            });
        })
        .catch((err) => console.log(err));
});

router.post("/rating/create", function (req, res, next) {
    const barbershopId = req.body.barbershopId
    const {comment,like} = req.body
    BarbershopInfo.find({}, function(err,data1){

        RatingInfo.find({customer:req.session.email,barbershop:barbershopId}, function(err,data){
            if(data.length > 0) {
                alert("Already commented")
                res.redirect("/customers/reservation")
            }
            else {
                const rating = new RatingInfo({comment,like,customer: req.session.email,barbershop:barbershopId})
                rating.save().then(()=>{
                    alert("Successfully reviews")
                    res.redirect("/customers/reservation")
                }).catch((error)=>{
                    alert(error)
                    res.redirect("/customers/reservation") 
                })
            };
        })

    })
});

module.exports = router;