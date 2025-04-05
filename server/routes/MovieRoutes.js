const router = require("express").Router()  
const Movie = require('../models/MovieModel')
//Add a movie
router.post("/add-movie",async (req,res) => {
    try{
        const newMovie = new Movie(req.body)
        await newMovie.save()
        return res.status(200).json({success:true,message:"New movie was added successfully"})
    }catch (err){
        return res.status(500).json({success:false, message: err.message})
    }
})
//Get all movies
router.get("/get-all-movies", async (req,res) => {
    try{
        const allMovies = await Movie.find()
        return res.send({success:true,message:"All movies have been fetched",data:allMovies})
    }catch (err){
        return res.send({success:false,message:err.message})
    }
})
//Get a movie by Id
router.get("/get-movie-by-id/:movieId",async (req,res) => {
    try{
        const movie = await Movie.findById(req.params.movieId)
        return res.send({success:true,message:"The movie has been fetched successfully", data:movie})
    }catch (err){
        return res.send({success:false,message:err.message})
    }
})
//Update a movie
router.put("/update-movie/:movieId", async (req,res) => {
    try{
        const movie = await Movie.findByIdAndUpdate(req.params.movieId,req.body)
        return res.send({success:true,message:"The movie has been updated successfully",data:movie})
    }catch (err){
        return res.send({success:false,message:err.message})
    }
})
//Delete a movie
router.delete("/delete-movie/:movieId", async (req,res) => {
    try{
        await Movie.findByIdAndDelete(req.params.movieId)
        return res.send({success:true,message:"The movie has been deleted successfully",})
    }catch (err){
        return res.send({success:false,message:err.message})
    }
})
module.exports = router