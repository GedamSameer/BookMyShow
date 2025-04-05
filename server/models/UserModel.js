const mongoose = require("mongoose")
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["admin","user","partner"],
        default:"user", 
        required: true,

    },
    otp:{type:String},
    otpExpiry:{type:Date}
})
module.exports = mongoose.model("users",UserSchema)