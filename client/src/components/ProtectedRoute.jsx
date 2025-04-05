import React, { useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { GetCurrentUser } from "../apicalls/users"
import { useDispatch,useSelector } from "react-redux"
import { HideLoading, ShowLoading } from "../redux/loaderSlice"
import { SetUser } from "../redux/userSlice"
import {Layout,Menu, message} from "antd"
import {Header} from "antd/es/layout/layout"
import {HomeOutlined,UserOutlined,ProfileOutlined,LogoutOutlined} from "@ant-design/icons"


const ProtectedRoute = ({children}) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {user} = useSelector((state) => state.user)
    const navItems = [
        {
            key: "home",
            label: "Home",
            icon: <HomeOutlined />,
            onClick: () => {
                navigate("/")
            }
        },
        {
            key: "user",
            label: `${user?.name||"User"}`,
            icon: <UserOutlined />,
            children: [
                {
                    key: "profile",
                    label:(<span onClick={() => {
                        if(user.role === "admin"){
                            navigate("/admin")
                        }else if(user.role === "partner"){
                            navigate("/partner")
                        }else{
                            navigate("/profile")
                        }
                    }}>My Profile</span>),
                    icon: <ProfileOutlined />
                },{
                    key: "logout",
                    label:(<Link  to="/login" onClick={() => {localStorage.removeItem("token")}}>LogOut</Link>),
                    icon: <LogoutOutlined />
                }
            ]
        }
    ]
    const cleanUpAndRedirect = () => {
        localStorage.removeItem("token")
        navigate("/login")
    }
    const getValidUserDetails = async() => {
        try{
            let result
            dispatch(ShowLoading())
            const response = await GetCurrentUser()
            dispatch(SetUser(response.data))
            dispatch(HideLoading())
        }catch (err){
            message.error(err?.response?.data?.message || err.message)
        }
    }
    useEffect(() => {
        if(localStorage.getItem("token")){
            getValidUserDetails()
        }else{
            navigate("/login")
        }
    },[])
    
    if(user){ 
        return (
            <>
            <Layout>
                <Header className="d-flex" 
                style={{
                    position:"sticky",
                    top: 0,
                    zIndex: 1,
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between"
                }} >
                    <h3 className="demo-logo text-white m-0" style={{color:"white"}} >BookMyShow</h3>
                    <Menu theme="dark" mode="horizontal" items={navItems} style={{ minWidth: "200px", overflow: "visible" }} />
                </Header>
                <div style={{padding: 24, minHeight: "100vh", background: "#fff" }} >{children}</div>
            </Layout>
            </>
            )
    }
}
export default ProtectedRoute