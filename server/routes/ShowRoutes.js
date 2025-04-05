const router = require("express").Router()  
const Show = require('../models/ShowModel')

//Add a Show
router.post("/add-show",async (req,res) => {
    try{
        const newShow = new Show(req.body)
        await newShow.save()
        return res.status(200).json({success:true,message:"New Show was added successfully"})
    }catch (err){
        return res.status(500).json({success:false, message: err.message})
    }
})
//Get all Shows by Theatre
router.get("/get-all-shows-by-theatre/:theatreId", async (req,res) => {
    try{
        const allShows = await Show.find({theatre:req.params.theatreId}).populate("movie")
        return res.send({success:true,message:"All Shows have been fetched",data:allShows})
    }catch (err){
        return res.send({success:false,message:err.message})
    }
})
//Get all Theatres by Movie
router.get("/get-all-theatre-by-movie/:movieId/:date", async (req,res) => {
    try{
        const {movieId,date} =req.params
        const shows = await Show.find({movie: movieId,date:new Date(date).toISOString()}).populate("theatre").sort({createdAt:1})
        let uniqueTheatres = []
        shows.forEach((show) => {
            let isTheatre = uniqueTheatres.find((theatre) => theatre._id === show.theatre._id)
            if(!isTheatre){
                let showsOfThisTheatre = shows.filter((showObj) => showObj.theatre._id === show.theatre._id).map((showObj) => {
                    const {theatre,...showWithOutTheatreInfo} = showObj._doc
                    return showWithOutTheatreInfo
                })
                uniqueTheatres.push({...show.theatre._doc, shows: showsOfThisTheatre})
            }
        })
        return res.send({success:true,message:"All theatres and their shows are fetched",data:uniqueTheatres})
    }catch (err){
        return res.send({success:false,message:err.message})
    }
})

//Get show by id
router.get("/get-show-by-id/:showId",async (req,res) => {
    try{
        const show = await Show.findById(req.params.showId).populate("movie").populate("theatre")
        return res.json({success:true,message:"Show fetched successfully",data:show}) 
    }catch (err){
        return res.send({success:false,message:err.message})
    }
})

//Update a Show
router.put("/update-show/:showId", async (req,res) => {
    try{
        const show = await Show.findByIdAndUpdate(req.params.showId,req.body)
        return res.send({success:true,message:"The movie has been updated successfully",data:show})
    }catch (err){
        return res.send({success:false,message:err.message})
    }
})
//Delete a Show
router.delete("/delete-show/:showId", async (req,res) => {
    try{
        await Show.findByIdAndDelete(req.params.showId)
        return res.send({success:true,message:"The Show has been deleted successfully",})
    }catch (err){
        return res.send({success:false,message:err.message})
    }
})
module.exports = router