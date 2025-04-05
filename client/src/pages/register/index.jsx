import '@ant-design/v5-patch-for-react-19';
import {Button, Form , Input, message, Radio} from "antd"
import {Link, useNavigate} from "react-router-dom"
import { RegisterUser } from "../../apicalls/users"
function Register(){
    const navigate = useNavigate()
    const onFinish = async (values) => {
        try{
            const response = await RegisterUser(values)
            if(response.success){
                message.success(response.message)
                navigate("/login")
            }else{
                message.error(response.message)
            }
        }catch (err){
            message.error(err)
        }
    }
    return(
        <>
        <div>
            <header className="App-header">
                <main className="main-area mv-500 text-center px-3">
                    <section className="left-section">
                        <h1>Register to BookMyShow</h1>
                    </section>
                    <section className="right-section">
                        <Form layout="vertical" onFinish={onFinish}>
                            <Form.Item label="Name" htmlFor="name" name="name" className="d-block" rules={[{required:true, message:"Name is required"}]}>
                                <Input id="name" type="text" placeholder="Enter your name"></Input>
                            </Form.Item>
                            <Form.Item label="Email" htmlFor="email" name="email" className="d-block" rules={[{required:true, message:"Email is required"}]}>
                                <Input id="email" type="email" placeholder="Enter your email"></Input>
                            </Form.Item>
                            <Form.Item label="Password" htmlFor="password" name="password" className="d-block" rules={[{required:true, message:"Password is required"}]}>
                                <Input id="password" type="password" placeholder="Enter your password"></Input>
                            </Form.Item>
                            
                            <Form.Item label="Register as Partner? " htmlFor='role' name='role' initialValue={false} >
                                <Radio.Group name='radiogroup' style={{display:"flex",justifyContent:"start"}}>
                                    <Radio value={"partner"}>Yes</Radio>
                                    <Radio value={"user"}>No</Radio>
                                </Radio.Group>
                            </Form.Item>
                            <Form.Item className="d-block">
                            <Button type="primary" block htmlType="submit" style={{fontSize:"1rem",fontWeight:"600"}}>Register</Button>
                            </Form.Item>
                            <div>
                                <p>Already a User? <Link to="/login">Login now</Link></p>
                            </div>
                        </Form>
                    </section>
                </main>
            </header>
        </div>
        </>
        
    )
}
export default Register