import { axiosInstance } from ".";
//Register
export const RegisterUser = async (payload) => {
    try{
        const response = await axiosInstance.post("/api/users/register",payload)
        return response.data
    }catch (err){
        return err
    }
}
//Login
export const LoginUser = async (payload) => {
    try{
        const response = await axiosInstance.post("/api/users/login",payload)
        return response.data
    }catch (err){
        return { success: false, message: err.response?.data?.message || "Login failed" };
    }
}
//Get Current User
export const GetCurrentUser = async () => {
    try{
        const response = await axiosInstance.get("/api/users/get-current-user",{
            headers:{
                'Authorization':`Bearer ${localStorage.getItem('token')}`
            }
        })
        return response.data
    }catch (err){
        return err
    }
}
//Forgot Password
export const ForgotPassword = async (values) => {
    try{
        const response = await axiosInstance.patch("/api/users/forgot-password",values)
        return response.data
    }catch (err){
        return err
    }
}
//Reset Password
export const ResetPassword = async (values) => {
    try{
        const response = await axiosInstance.patch("/api/users/reset-password",values)
        return response.data
    }catch (err){
        return err
    }
}