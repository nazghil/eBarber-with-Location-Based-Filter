var bycrypt = require("bcryptjs");
var mongoose = require("mongoose");
// var ObjectId = require("mongodb").ObjectId;
// var barbershopID = new ObjectId();

const SALT_FACTOR = 10;

const ratingSchema = new mongoose.Schema({ 

    comment:{
        type:String,
    },
    like:{
        type:Boolean,
    },
    barbershop:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'barbershop'
    },
    customer:{
        type:String,
        required:true,
    }

},{
    timestamps:true
})

const RatingInfo = mongoose.model("rating",ratingSchema);

module.exports = {RatingInfo};