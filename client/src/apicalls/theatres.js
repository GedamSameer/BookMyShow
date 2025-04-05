import { axiosInstance } from ".";
//Get all theatres
export const getAllTheatres = async () => {
    try{
        const response = await axiosInstance.get("api/theatres/get-all-theatres")
        return response.data
    }catch (err){
        console.log(err)
    }
}
//Get all theatres for Individual partner
export const getAllTheatresByOwner = async (ownerId) => {
    try{
        const response = await axiosInstance.get(`api/theatres/get-all-theatres/${ownerId}`)
        return response.data
    }catch (err){
        console.log(err)
    }
}
//Add a theatre
export const addTheatre = async (payload) => {
    try{
        const response = await axiosInstance.post("/api/theatres/add-theatre",payload)
        return response.data
    }catch (err){
        console.log(err)
    }
}
//Update a theatre
export const updateTheatre = async (theatreId,payload) => {
    try{
        const response = await axiosInstance.put(`/api/theatres/update-theatre/${theatreId}`,payload)
        return response.data
    }catch (err){
        console.log(err)
    }
}
//Delete a theatre
export const deleteTheatre = async (theatreId) => {
    try{
        const response = await axiosInstance.delete(`/api/theatres/delete-theatre/${theatreId}`)
        return response.data
    }catch (err){
        console.log(err)
    }
}
