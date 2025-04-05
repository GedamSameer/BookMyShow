const router = require("express").Router()  
const Theatre = require('../models/TheatreModel')
//Add a Theatre
router.post("/add-theatre",async (req,res) => {
    try{
        const newTheatre = new Theatre(req.body)
        await newTheatre.save()
        return res.status(200).json({success:true,message:"New Theatre was added successfully"})
    }catch (err){
        return res.status(500).json({success:false, message: err.message})
    }
})
//Get all Theatres for admin
router.get("/get-all-theatres", async (req,res) => {
    try{
        const allTheatres = await Theatre.find().populate({path:"owner",select:'-password'})
        return res.send({success:true,message:"All Theatres have been fetched",data:allTheatres})
    }catch (err){
        return res.send({success:false,message:err.message})
    }
})
//Get all Theatres for individual partners
router.get("/get-all-theatres/:ownerId", async (req,res) => {
    try{
        const allTheatres = await Theatre.find({owner:req.params.ownerId }).populate({path:"owner",select:'-password'})
        return res.send({success:true,message:"All Theatres have been fetched",data:allTheatres})
    }catch (err){
        return res.send({success:false,message:err.message})
    }
})
//Update a Theatre
router.put("/update-theatre/:theatreId", async (req,res) => {
    try{
        const theatre = await Theatre.findByIdAndUpdate(req.params.theatreId,req.body)
        return res.send({success:true,message:"The Theatre has been updated successfully",data:theatre})
    }catch (err){
        return res.send({success:false,message:err.message})
    }
})
//Delete a Theatre
router.delete("/delete-theatre/:theatreId", async (req,res) => {
    try{
        await Theatre.findByIdAndDelete(req.params.theatreId)
        return res.send({success:true,message:"The Theatre has been deleted successfully",})
    }catch (err){
        return res.send({success:false,message:err.message})
    }
})
module.exports = router