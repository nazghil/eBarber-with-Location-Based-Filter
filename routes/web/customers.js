var express = require("express");
var bcrypt = require("bcryptjs");
var flash = require("connect-flash");
var router = express.Router();
const { CustomerInfo } = require("../../models/customer_info");
const { BarbershopInfo } = require("../../models/barbershop_info");
const { BookInfo } = require("../../models/book_info");
const { RatingInfo } = require("../../models/reviews");

router.get("/", function (req, res) {
	res.render("landing");
});

//register
router.get("/register", function(req,res){
    res.render("customers/register");
});

//login
router.get("/login", function(req,res){
    res.render("customers/login");
});

//profile
// router.get("/profile", function(req,res){
//     res.render("customers/profile");
// });

router.get("/booking/:barberemail", function(req,res){
    var barberEmail = req.params.barberemail;
    CustomerInfo.findOne({email: req.session.email}, function(err,data){
        if(data){
            BarbershopInfo.findOne({email:barberEmail}, function(err,data1){
                if(data){
                    res.render("customers/booking", {data, data1})
                } else {
                    res.redirect("/customers/home")
                }
            })
        }
    })
});

//dashboard
router.get("/dashboard", function(req,res){
    res.render("customers/dashboard");
});

//nearestbarbershop
router.get("/nearestbarbershop", function(req,res){
    BarbershopInfo.find({}, function (err, data) {
        console.log(data);
        if(data){
            res.render("customers/nearestbarbershop", {data});
        } else throw err;
    })
});

//reservation
router.get("/reservation", function (req, res, next) {
    let barbershop
    let {barbershopName,barbershopState,sort} = req.query 
    let sortedBy={}
    let storesQuery = {}
    let queries = {}

    if(typeof barbershopName == 'string' && barbershopName?.length>0){
        queries['barbershopName']= barbershopName
    }
    if(typeof barbershopState == 'string' && barbershopState?.length>0){
        queries['barbershopState']= barbershopState
    }

    BarbershopInfo.find(queries, function(err,data) {
        let barbershops = []
        for(let barbershop of data){
            barbershops.push(RatingInfo.count({barbershop:barbershop._id,like:true}).then(data1=>{
                return RatingInfo.count({barbershop:barbershop._id,like:false}).then(data2=>{
                    let detail = barbershop.toObject()
                    detail.likes = data1
                    detail.dislikes = data2


                    // console.log(detail)
                    return detail
                })
            }))

        }
        Promise.all(barbershops).then(result => {
            let sorted = result
                if(typeof sort == 'string'&&sort?.length>0){
                    switch(sort){
                        case 'LR':
                            sorted.sort((a, b) => b.dislikes - a.dislikes || a.likes - b.likes);
                        break
                        case 'TR':
                            sorted.sort((a, b) => b.likes - a.likes || a.dislikes - b.dislikes);
                        break
                        default:
                            sorted
                    }
                }
            res.render("customers/reservation",{
                barbershop: sorted
            })
        })
    })
})

//profile
router.get("/profile", function (req, res, next) {
    var bookings = [];
    BookInfo.find({ emailCust: req.session.email }, function (err, data) {
		if (!data) {
			console.log("not found");
			res.render("/barbershops/profile");
		} else {
			BarbershopInfo.find({}, function (err, data1) {
				for (let bookinfo of data) {
					for (let dataBarber of data1) {
						if (dataBarber.email === bookinfo.emailBarber) {
							let booking = bookinfo;
							booking.barberName = dataBarber.barbershopName;
                            booking.email = dataBarber.email;
                            booking.contact = dataBarber.barbershopContact;
                            booking.address = dataBarber.barbershopAddress;
                            booking.date = bookinfo.bookDate;
                            booking.time = bookinfo.bookTime;
							bookings.push(booking);
						}
					}
                }
                CustomerInfo.findOne({ email: req.session.email }, function (err, data2) {
                    if (!data2) {
                        console.log("not found");
                        res.redirect("/");
                    } else {
                        res.render("customers/profile", {
                            username: data2.username,
                            contact: data2.contact,
                            fullname: data2.fullname,
                            email: data2.email,
                            bookings
                        });
                    }
                })
			});
		}
	});
    // CustomerInfo.findOne({ email: req.session.email }, function (err, data){
    //     if (data){
    //     } else {
    //         res.render("customers/home");
    //     }
    //     });
});

//profile
router.get("/reviews/:barbershopID", function(req, res, next){
    CustomerInfo.findOne({ email: req.session.email }, function (err, data){
        if (data){
            BarbershopInfo.findOne({_id:req.params.barbershopID}, function(err,data2){
                RatingInfo.find({barbershop:req.params.barbershopID}, function(err,data1){
                    if(data1){
                        res.render("customers/reviews", {
                            ratings: data1,barbershop:data2
                        });
                    }
                    else{
                        res.render("customers/reviews", {
                            barbershop:data2
                        });
                    }
                });
            })

        };
        });
});

//details
router.get("/:barbershopID", function(req, res, next){
    CustomerInfo.findOne({ email: req.session.email }, function (err, data){
        if (data){
            BarbershopInfo.findOne({_id:req.params.barbershopID}, function(err,data1){
                if(data1){
                    res.render("customers/detail", {
                        barbershop: data1
                    });
                }
            })
        }
        });
});



module.exports = router;
