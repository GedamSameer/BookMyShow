import { useDispatch,useSelector } from "react-redux"
import { ShowLoading,HideLoading } from "../../redux/loaderSlice"
import {getAllTheatresByOwner} from "../../apicalls/theatres"
import {EditOutlined,DeleteOutlined} from "@ant-design/icons"
import { Button,Table } from "antd"
import { useState,useEffect} from "react"
import TheatreForm from "./TheatreForm"
import DeleteTheatreModal from "./TheatreDelete"
import ShowModal from "./ShowModel"

const TheatreList = () => {
    const {user} = useSelector((state) => state.user)
    const [isShowModalOpen,setIsShowModalOpen] = useState(false)
    const [isModalOpen,setIsModalOpen] = useState(false)
    const [theatres,setTheatres] = useState([])
    const [selectedTheatre,setSelectedTheatre] = useState(null)
    const [formType,setFormType] = useState("add")
    const [isDeleteModalOpen,setIsDeleteModalOpen] = useState(false)
    const columns = [
    {title:"Name",dataIndex:"name",key:"name"},
    {title:"Address",dataIndex:"address",key:"address"},
    {title:"Phone Number",dataIndex:"phone",key:"phone"},
    {title:"Email",dataIndex:"email",key:"email"},
    {title:"Status",dataIndex:"status",key:"status",render: (status,data) => {
        if(data.isActive){return "Approved"}else{return "Pending/Blocked"}}},
    {title:"Action",dataIndex:"action",key:"action",render: (text,data) => {
        return(
        <>
        <div>
            <Button onClick={() => {
                setIsModalOpen(true)
                setFormType("edit")
                setSelectedTheatre(data)
            }}><EditOutlined /></Button>
            <Button onClick={() => {
                setIsDeleteModalOpen(true)
                setSelectedTheatre(data)
            }}><DeleteOutlined /></Button>
            {data.isActive && <Button onClick={() => {
                setIsShowModalOpen(true)
                setSelectedTheatre(data)    
            }}>Add Shows</Button>}
        </div>
        </>
        )
    }},
    ]
    const dispatch = useDispatch()
    const getData = async () => {
        dispatch(ShowLoading())
        const response = await getAllTheatresByOwner(user._id)
        const allTheatres = response.data
        setTheatres(allTheatres.map((item) => {
            return {...item,key:`theatre_${item._id}`}
        }))
        dispatch(HideLoading())
    }
    useEffect(() => {
        getData()
    },[])
    return (
        <div>
        <div className="d-flex justify-content-end w-100" style={{display:"flex",justifyContent:"end", margin:"0 1rem 1rem 0"}}>
            <Button onClick={() => {
                setIsModalOpen(true)
                setFormType("add")
            }}>Add Theatre</Button>
            </div>
        <Table dataSource={theatres} columns={columns} tableLayout="fixed"/>
        
        {
            isShowModalOpen && 
            <ShowModal selectedTheatre={selectedTheatre} isShowModalOpen={isShowModalOpen} setIsShowModalOpen={setIsShowModalOpen}  />
        }
        {
            isModalOpen &&
            <TheatreForm setIsModalOpen={setIsModalOpen} selectedTheatre={selectedTheatre} setSelectedTheatre={setSelectedTheatre} formType={formType} getData={getData} />
        }
        {   
            isDeleteModalOpen && 
            <DeleteTheatreModal isDeleteModalOpen={isDeleteModalOpen} setIsDeleteModalOpen={setIsDeleteModalOpen} selectedTheatre={selectedTheatre} setSelectedTheatre={setSelectedTheatre} getData={getData} />
        }
        </div>
    )
}
export default TheatreList