const router = require("express").Router()
const moment = require("moment")
const AuthMiddleware = require("../middlewares/AuthMiddleware")
const Booking = require("../models/BookingModel")
const Show = require("../models/ShowModel")
const EmailHelper = require("../utils/EmailHelper")
const stripe = require("stripe")(process.env.stripe_key)
//Create a booking after payment
router.post("/book-show",AuthMiddleware,async (req,res) => {
  try{
    const newBooking = new Booking(req.body)
    await newBooking.save()
    const show = await Show.findById(req.body.show).populate("movie")
    const udpatedBookedSeats = [...show.bookedSeats,...req.body.seats]
    await Show.findByIdAndUpdate(req.body.show,{bookedSeats:udpatedBookedSeats})
    const populatedBooking = await Booking.findById(newBooking._id)
     .populate({path:"user",model:"users",select:"email"})
     .populate({path:"show",populate:[{path:"movie",model:"movies"},{path:"theatre",model:"theatres"}]})
     console.log(populatedBooking)
    const formattedDate = moment(populatedBooking.show.date).format("DD MMM YYYY")
    const formattedTime = moment(populatedBooking.show.time,"HH:mm").format("hh:mm A")
    await EmailHelper("ticketTemplate.html",populatedBooking.user.email,{
      posterUrl: populatedBooking.show.movie.poster,
      movieName: populatedBooking.show.movie.movieName,
      theatreName:populatedBooking.show.theatre.name,
      seatsList: populatedBooking.seats.join(", "),
      formattedDate: formattedDate,
      formattedTime: formattedTime,
      totalAmount: populatedBooking.seats.length * populatedBooking.show.ticketPrice,
      transactionId:populatedBooking.transactionId
    })
    return res.send({success:true,message:"New booking done!",data:newBooking})
  }catch (err){
    return res.send({success:false,message:err.message})
  }
})
router.get("/get-all-bookings",AuthMiddleware,async (req,res) => {
    try{
        const bookings = await Booking.find({user:req.userId}).populate("user").populate("show")
        .populate({path:"show",populate:{path:"movie",model:"movies"}})
        .populate({path:"show",populate:{path:"theatre",model:"theatres"}})
        return res.send({success:true,message:"Bookings fetched!",data:bookings})
    }catch (err){
        return res.send({success:false,message:err.message})
    }
})
//Make Payment
router.post("/make-payment", async (req, res) => {
    try {
      const { token, amount } = req.body;
      const customer = await stripe.customers.create({
        email: token.email,
        source: token.id,
      });
  
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: "usd",
        customer: customer.id,
        payment_method_types: ["card"],
        receipt_email: token.email,
        description: "Token has been assigned to the movie!",
      });
  
       const transactionId = paymentIntent.id;
  
      res.send({
        success: true,
        message: "Payment Successful! Ticket(s) booked!",
        data: transactionId,
      });
    } catch (err) {
      res.send({
        success: false,
        message: err.message,
      });
    }
  });
  
  module.exports = router