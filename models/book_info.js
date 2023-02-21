var bycrypt = require("bcryptjs");
var mongoose = require("mongoose");
// var ObjectId = require("mongodb").ObjectId;
// var barbershopID = new ObjectId();

const SALT_FACTOR = 10;

var book_info = new mongoose.Schema({
    // barbershopID: {type: ObjectId, required: true},
    emailBarber:{type:String, required:true},
    emailCust:{type:String, required:true},
    bookTime:{type:String,required:true},
    bookDate:{type:String,required:true},
});

const BookInfo = mongoose.model("book",book_info);

module.exports = {BookInfo};