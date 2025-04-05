import {Link, useNavigate} from "react-router-dom"
import {Button, Form, Input, message} from "antd"
import {ForgotPassword} from "../../apicalls/users"
import { useEffect } from "react"
const Forgot = () => {
    const navigate = useNavigate()
    const onFinish = async (values) => {
        try{
            const response = await ForgotPassword(values)
            if(response.status === "success"){
                message.success(response.success)
                alert("OTP sent to your email")
                window.location.href = "/reset"
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
                <section><h1>Forgot Password</h1></section>
                <section>
                    <Form layout="vertical" onFinish={onFinish}>
                        <Form.Item label="Email" htmlFor="email" name="email" rules={[{required:true,message:"Email is required"}]}>
                            <Input id="email" type="text" placeholder="Enter your Email" />
                        </Form.Item>
                        <Form.Item><Button type="primary" htmlType="submit">SEND OTP</Button></Form.Item>
                    </Form>
                    <div><p>Existing User? <Link to="/login">Login Here</Link></p></div>
                </section>
            </main>
        </header>
        </>
    )
}
export default Forgot