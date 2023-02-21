var bycrypt = require("bcryptjs");
var mongoose = require("mongoose");
// var ObjectId = require("mongodb").ObjectId;

const SALT_FACTOR = 10;

var admin_info = new mongoose.Schema({
    // adminID: {type: ObjectId, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
});

admin_info.pre("save",function(done){
    var admin = this;
    if(
        !admin.isModified("password")
    )
    {return done();}
    bycrypt.genSalt(SALT_FACTOR,function(err,salt){
        if(err)
        {return done(err);}
        bycrypt.hash(admin.password,salt,function(err,hashedPassword){
            if(err )
            {return done(err);}
            admin.password = hashedPassword;
            done();
        });
    });
});

admin_info.methods.checkPassword = function(guess,done){
    if(this.password != null){
        bycrypt.compare(guess,this.password,function(err,isMatch){
            done(err,isMatch);
        });
    }
};

const AdminInfo = mongoose.model("admin",admin_info);

module.exports = {AdminInfo};