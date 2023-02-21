var express = require("express");
var passport = require("passport");
const { BarbershopInfo } = require("../../models/barbershop_info");
const { BookInfo } = require("../../models/book_info");
const { CustomerInfo } = require("../../models/customer_info");
const { RatingInfo } = require("../../models/reviews");
var router = express.Router();

router.get("/register",function(req,res){
    res.render("barbershops/register");
})

router.get("/login",function(req,res){
    res.render("barbershops/login");
})

router.get("/dashboard", function(req,res){
    res.render("barbershops/dashboard");
});

//nearestbarbershop
// router.get("/nearestbarbershop", function(req,res){
//     res.render("customers/nearestbarbershop");
// });

//reservation
router.get("/reservation", function (req, res) {
    var bookings = [];
    BookInfo.find({ emailBarber: req.session.email }, function (err, data) {
		if (!data) {
			console.log("not found");
			res.render("/barbershops/profile");
		} else {
			CustomerInfo.find({}, function (err, data1) {
				for (let bookinfo of data) {
					for (let dataCust of data1) {
						if (dataCust.email === bookinfo.emailCust) {
							let booking = bookinfo;
							booking.username = dataCust.username;
                            booking.email = dataCust.email;
                            booking.contact = dataCust.contact;
                            booking.fullname = dataCust.fullname;
                            booking.date = bookinfo.bookDate;
                            booking.time = bookinfo.bookTime;
							bookings.push(booking);
						}
					}
                }
                res.render("barbershops/reservation", {
                    bookings
                });
			});
		}
	});
    // BookInfo.find({emailBarber:req.session.email}, function(err,data){
    //     res.render("barbershops/reservation", {data});
    // })
});

//delete
router.get("/delete/:id", function(req, res){
    var id = req.params.id;
    console.log(id);
    BookInfo.findOneAndRemove({ _id: id}, function (err,data){
        if(data){
            res.redirect("/barbershops/reservation");
        }
    });
});
    

//profile
router.get("/profile", function(req, res, next){
    BarbershopInfo.findOne({ email: req.session.email }, function (err, data){
        if (data){
            res.render("barbershops/profile", {
                barbershopName: data.barbershopName,
                barbershopContact: data.barbershopContact,
                barbershopAddress: data.barbershopAddress,
                email: data.email,
                barbershopState: data.barbershopState,
                description: data.description,
                price: data.price,
            });
        } else {
            res.render("barbershops/home");
        }
        });
});

//review
router.get("/review", function(req, res, next){
            BarbershopInfo.findOne({email:req.session.email}, function(err,data2){
                RatingInfo.find({barbershop:data2._id}, function(err,data1){
                    if(data1){
                        res.render("barbershops/review", {
                            ratings: data1,barbershop:data2
                        });
                    }
                    else{
                        res.render("barbershops/review", {
                            barbershop:data2
                        });
                    }
                });
            })
});


module.exports = router;
