var bycrypt = require("bcryptjs");
var mongoose = require("mongoose");
// var ObjectId = require("mongodb").ObjectId;
// var barbershopID = new ObjectId();

const SALT_FACTOR = 10;

var barbershop_info = new mongoose.Schema({
    // barbershopID: {type: ObjectId, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    barbershopName: {type: String, required: true},
    barbershopContact: {type: String, required: true},
    barbershopAddress: {type: String, required: true},
    barbershopState: {type: String, required: true},
    description: {type: String, required: false},
    price: {type: String, required: false},
    long: {type:String, required:true},
    lat: {type: String, required:true},
});

barbershop_info.pre("save",function(done){
    var barbershop = this;
    if(
        !barbershop.isModified("password")
    )
    {return done();}
    bycrypt.genSalt(SALT_FACTOR,function(err,salt){
        if(err)
        {return done(err);}
        bycrypt.hash(barbershop.password,salt,function(err,hashedPassword){
            if(err )
            {return done(err);}
            barbershop.password = hashedPassword;
            done();
        });
    });
});

barbershop_info.methods.checkPassword = function(guess,done){
    if(this.password != null){
        bycrypt.compare(guess,this.password,function(err,isMatch){
            done(err,isMatch);
        });
    }
};

const BarbershopInfo = mongoose.model("barbershop",barbershop_info);

module.exports = {BarbershopInfo};