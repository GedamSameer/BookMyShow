const mongoose = require("mongoose")
const ShowSchema = new mongoose.Schema({
    name:{type:String,required:true},
    date:{type:Date,required:true},
    time:{type:String,required:true},
    ticketPrice:{type:String,required:true},
    movie:{type:mongoose.Schema.Types.ObjectId,ref:"movies",required:true},
    totalSeats:{type:String,required:true},
    bookedSeats:{type:Array,default:[]},
    theatre:{type:mongoose.Schema.Types.ObjectId,ref:"theatres",required:true}
},{timestamps:true})
module.exports = mongoose.model("shows",ShowSchema)