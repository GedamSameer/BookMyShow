import {Button, Form , Input, message} from "antd"
import {Link,useNavigate} from "react-router-dom"
import { LoginUser } from "../../apicalls/users"
function Login(){
    const navigate = useNavigate()
    const onFinish = async (values) => {
        try{
            const response = await LoginUser(values)
            if(response.success){
                message.success(response.message)
                localStorage.setItem("token",response.data)
                navigate("/")
            }else{
                message.error(response.message)
            }
        }catch (err){
            message.error(err.message)
        }
    }
    return(
        <>
        <div>
            <header className="App-header">
                <main className="main-area mv-500 text-center px-3">
                    <section className="left-section">
                        <h1>Login to BookMyShow</h1>
                    </section>
                    <section className="right-section">
                        <Form layout="vertical" onFinish={onFinish}>
                            <Form.Item label="Email" htmlFor="email" name="email" className="d-block" rules={[{required:true, message:"Email is required"}]}>
                                <Input id="email" type="email" placeholder="Enter your email"></Input>
                            </Form.Item>
                            <Form.Item label="Password" htmlFor="password" name="password" className="d-block" rules={[{required:true, message:"Password is required"}]}>
                                <Input id="password" type="password" placeholder="Enter your password"></Input>
                            </Form.Item>
                            <Form.Item className="d-block">
                            <Button type="primary" block htmlType="submit" style={{fontSize:"1rem",fontWeight:"600"}}>Login</Button>
                            </Form.Item>
                            <div>
                                <p>New User? <Link to="/register">Register Here</Link></p>
                                <p>Forgot Password? <Link to="/forgot">Click Here</Link></p>
                            </div>
                        </Form>
                    </section>
                </main>
            </header>
        </div>
        </>
        
    )
}
export default Login