const express = require("express")
const app = express()
const cors = require("cors")
const path = require("path")
const rateLimit = require("express-rate-limit")
const helmet = require("helmet")
const mongoSanitize = require("express-mongo-sanitize")
const userRoutes = require("./routes/UserRoutes")
const movieRoutes = require("./routes/MovieRoutes")
const theatreRoutes = require("./routes/TheatreRoutes")
const showRoutes = require("./routes/ShowRoutes")
const bookingRoutes = require("./routes/BookingRoutes")
//Use helmet for setting various HTTP headers for security
app.use(helmet())
//Custom Content Security Policy (CSP) configuration 
app.use(
    helmet.contentSecurityPolicy({
        directives:{
            defaultSrc:["'self'"],
            scriptSrc:["'self'","example.com"],
            styleSrc:["'self'","'unsafe-inline'"],
            imgSrc:["'self'","data:","example.com"],
            connectSrc:["'self'","api.example.com"],
            fontSrc:["'self'","fonts.gstatic.com"],
            objectSrc:["'none'"],
            upgradeInsecureRequests:[]
}}))
require("dotenv").config()
require("./config/db")
//Rate Limit middleware
const apiLimiter = rateLimit({
    windowMs: 15*60*1000,
    max: 100, //Limit each IP to 100 request per windowMs
    message: "Too many requests, Please try after some time."
})
//Sanitize user input to prevent MongoDB operator injection
app.use(mongoSanitize())
app.use(express.json())
app.use(cors())
//Apply API limiter to all routes
app.use("/api/",apiLimiter)
app.use("/api/users",userRoutes)
app.use("/api/movies",movieRoutes)
app.use("/api/theatres",theatreRoutes)
app.use("/api/shows",showRoutes)
app.use("/api/bookings",bookingRoutes)

app.get("/",(req,res) => {
    res.send("Hello World")
})
app.listen(3001, () => {
    console.log("Server is running")
})
const publicPath = path.join(__dirname,"../client/dist")
app.use(express.static(publicPath))
app.get("*", (req,res) => {
    res.sendFile(path.join(publicPath,"index.html"))
})
