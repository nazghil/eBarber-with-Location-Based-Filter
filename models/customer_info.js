var bycrypt = require("bcryptjs");
var mongoose = require("mongoose");
// var ObjectId = require("mongodb").ObjectId;
// var customerID = new ObjectId();

const SALT_FACTOR = 10;

var customer_info = new mongoose.Schema({
    // customerID: {type: ObjectId, required: true},
    username: {type: String, required: true},
    password: {type: String, required: true},
    fullname: {type: String, required: true},
    email: {type: String, required: true},
    contact: {type: String, required: true},
});

customer_info.pre("save",function(done){
    var customer = this;
    if(
        !customer.isModified("password")
    )
    {return done();}
    bycrypt.genSalt(SALT_FACTOR,function(err,salt){
        if(err)
        {return done(err);}
        bycrypt.hash(customer.password,salt,function(err,hashedPassword){
            if(err )
            {return done(err);}
            customer.password = hashedPassword;
            done();
        });
    });
});

customer_info.methods.checkPassword = function(guess,done){
    if(this.password != null){
        bycrypt.compare(guess,this.password,function(err,isMatch){
            done(err,isMatch);
        });
    }
};

const CustomerInfo = mongoose.model("customer",customer_info);

module.exports = {CustomerInfo};