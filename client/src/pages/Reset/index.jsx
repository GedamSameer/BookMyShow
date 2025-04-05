import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ResetPassword } from "../../apicalls/users"
import { Button, Form, Input, message } from "antd"

const Reset = () => {
    const navigate = useNavigate()
    const onFinish = async (values) => {
        try{
            const response = await ResetPassword(values)
            if(response.status === "success"){
                message.success(response.message)
                window.location.href = "/login"
            }else{
                message.error(response.message)
            }
        }catch (err){
            message.error(err.message)
        }
    }
    useEffect(() => {
        if(localStorage.getItem("token")){
            navigate("/")
        }
    },[])
    return (
        <>
        <header>
            <main>
                <section><h1>Reset Password</h1></section>
                <section>
                    <Form layout="vertical" onFinish={onFinish}>
                        <Form.Item label="OTP" htmlFor="otp" name="otp" rules={[{required:true,message:"OTP is required"}]}>
                            <Input id="otp" type="number" placeholder="Enter your OTP"/>
                        </Form.Item>
                        <Form.Item label="Password" htmlFor="password" name="password" rules={[{required:true,message:"Password is required"}]}>
                            <Input id="password" type="text" placeholder="Enter your Password"/>
                        </Form.Item>
                        <Form.Item><Button type="primary" htmlType="submit">RESET PASSWORD</Button></Form.Item>
                    </Form>
                </section>
            </main>
        </header>
        </>
    )
}
export default Reset