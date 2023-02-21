var express = require("express");
var passport = require("passport");
const { BarbershopInfo } = require("../../models/barbershop_info");
const { BookInfo } = require("../../models/book_info");
const { CustomerInfo } = require("../../models/customer_info");
const { AdminInfo } = require("../../models/admin_info");
var router = express.Router();


router.get("/register", function(req,res){
    res.render("customers/register");
});

router.get("/login",function(req,res){
    res.render("admin/login");
})

router.get("/dashboard", function(req,res){
    res.render("admin/dashboard");
});

//cus
router.get("/customers", function(req, res, next){
    AdminInfo.findOne({ email: req.session.email }, function (err, data){
        CustomerInfo.find({}, function(err,data1){
            if (data){
                res.render("admin/customers", {
                    admin: data,users: data1
                });
            } else {
                res.render("admin/customers");
            }
            });
        })

});

//delete
router.get("/delete/:id", function(req, res){
    var id = req.params.id;
    console.log(id);
    CustomerInfo.findOneAndRemove({ _id: id}, function (err,data){
        if(data){
            res.redirect("/admin/customers");
        }
    });
});

//cus
router.get("/barbershops", function(req, res, next){
    AdminInfo.findOne({ email: req.session.email }, function (err, data){
        BarbershopInfo.find({}, function(err,data1){
            if (data){
                res.render("admin/barbershops", {
                    admin: data,users: data1
                });
            } else {
                res.render("admin/barbershops");
            }
            });
        })

});

//delete
router.get("/deletebarbershops/:id", function(req, res){
    var id = req.params.id;
    console.log(id);
    BarbershopInfo.findOneAndRemove({ _id: id}, function (err,data){
        if(data){
            res.redirect("/admin/barbershops");
        }
    });
});

module.exports = router;
