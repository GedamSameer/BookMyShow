import { axiosInstance } from ".";
//Get all movies
export const getAllMovies = async () => {
    try{
        const response = await axiosInstance.get("api/movies/get-all-movies")
        return response.data
    }catch (err){
        console.log(err)
    }
}
//Get a movie by Id
export const getMovieById = async (movieId) => {
    try{
        const response = await axiosInstance.get(`api/movies/get-movie-by-id/${movieId}`)
        return response.data
    }catch (err){
        console.log(err)
    }
}
//Add a movie
export const addMovie = async (payload) => {
    try{
        const response = await axiosInstance.post("/api/movies/add-movie",payload)
        return response.data
    }catch (err){
        console.log(err)
    }
}
//Update a movie
export const updateMovie = async (movieId,payload) => {
    try{
        const response = await axiosInstance.put(`/api/movies/update-movie/${movieId}`,payload)
        return response.data
    }catch (err){
        console.log(err)
    }
}
//Delete a movie
export const deleteMovie = async (movieId) => {
    try{
        const response = await axiosInstance.delete(`/api/movies/delete-movie/${movieId}`)
        return response.data
    }catch (err){
        console.log(err)
    }
}
