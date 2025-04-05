const router = require("express").Router()
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const User = require("../models/UserModel")
const AuthMiddleware = require("../middlewares/AuthMiddleware")
const EmailHelper = require("../utils/EmailHelper")


function otpGenerator(){
    return Math.floor(Math.random() * 10000 +90000)
}


//Register a User
router.post("/register",async (req,res) => {
    try{
        const userExists = await User.findOne({email:req.body.email})
        if(userExists){
            return res.status(400).json({success:false,message:"User Already Exists"})
        }
        //Bcrypt
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password,salt)
        req.body.password = hashedPassword
        const newUser = new User(req.body)
        await newUser.save()
        return res.status(201).json({success:true,message:"Registration Successful"})
    }catch(err){
        return res.status(500).json({success:false,message:err.message})
    }
})
//User Login
router.post("/login",async (req,res) => {
    try{
        const user = await User.findOne({email:req.body.email})
        if(!user){
            return res.status(400).json({success:false,message:"User Doesnt Exists"})
        }
        const validPassword = await bcrypt.compare(req.body.password,user.password)
        if(!validPassword){
            return res.status(401).json({success:false,message:"Invalid Password"})
        }
        const token = jwt.sign({userId: user._id },process.env.jwt_secret,{expiresIn:"1d"})
        return res.status(200).json({success:true,message:"Login Successful",data:token})
    }catch (err){
        return res.status(500).json({success:false,message:err.message})

    }
})
//User Authentication
router.get("/get-current-user",AuthMiddleware,async (req,res) => {
    try{
        const user = await User.findById(req.userId).select('-password')
        return res.send({
            success: true,
            message: "User details fetched successfully",
            data: user
        })
    }catch (err){
        return res.status(500).json({success:false,message:err.message})
    }
})
//Forgot Password
router.patch("/forgot-password",async (req,res) => {
    try{
        if(req.body.email === undefined){
            return res.status(401).json({status:"failure",message:"Please enter the email"})
        }
        let user = await User.findOne({email:req.body.email})
        if(user === null){
            return res.status(404).json({status:"failure",message:"No such user found"})
        }
        const otp = otpGenerator()
        user.otp = otp
        user.otpExpiry = Date.now() + 10*60*1000
        await user.save()
        await EmailHelper("otp.html",user.email,{name:user.name,otp:otp})
        return res.status(200).json({status:"success",message:`OTP sent to email: ${req.body.email}`})
    }catch (err){
        return res.status(500).json({success:false,message:err.message})
    }
})
//Reset Password
router.patch("/reset-password",async (req,res) => {
    try{
        let resetDetails = req.body
        if(!resetDetails.password || !resetDetails.otp){
            return res.status(401).json({status:"failure",message:"Invalid request"})
        }
        const user = await User.findOne({otp: resetDetails.otp})
        if(user === null){
            return res.status(404).json({status:"failure",message:"OTP Incorrect"})
        }
        if(Date.now()>user.otpExpiry){
            return res.status(401).json({status:"failure",message:"OTP Expired"})
        }
        //Bcrypt
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(resetDetails.password,salt)

        user.password = hashedPassword
        user.otp = undefined
        user.otpExpiry = undefined
        await user.save()
        return res.status(200).json({status:"success",message:"Password reset was successful"})
    }catch (err){
        return res.status(500).json({success:false, message:err.message})
    }
})

module.exports = router