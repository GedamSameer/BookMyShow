import axios from "axios"
export const axiosInstance = axios.create({
    baseURL: "https://bms-lwri.onrender.com/",
    headers:{
        withCredentials: true,
        "Content-Type": "application/json",
    }
})