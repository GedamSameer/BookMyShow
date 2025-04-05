import { axiosInstance } from ".";

export const makePayment = async (values) => {
    try{
        const response = await axiosInstance.post("/api/bookings/make-payment",values,{headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}})
        return response.data
    }catch (err){
        console.log(err)
    }
}
export const bookShow = async (values) => {
    try{
        const response = await axiosInstance.post("/api/bookings/book-show",values,{headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}})
        return response.data
    }catch (err){
        console.log(err)
    }
}
export const getAllBookings = async () => {
    try{
        const response = await axiosInstance.get("/api/bookings/get-all-bookings",{headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}})
        return response.data
    }catch (err) {
        console.log(err)
    }
}