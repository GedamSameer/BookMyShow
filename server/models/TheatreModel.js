const mongoose = require("mongoose")
const TheatreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    isActive:{
        type: Boolean,
        default: false
    }
})
module.exports = mongoose.model("theatres",TheatreSchema)