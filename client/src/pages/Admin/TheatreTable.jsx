import { Button, message, Table } from "antd"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { HideLoading, ShowLoading } from "../../redux/loaderSlice"
import { getAllTheatres, updateTheatre } from "../../apicalls/theatres"

function TheatreTable(){
    const [theatres,setTheatres] = useState([])
    const dispatch = useDispatch()
    const handleStatusChange = async (theatre) => {
        try{
            dispatch(ShowLoading())
            let values = {...theatres, isActive: !theatre.isActive}
            const response = await updateTheatre(theatre._id,values)
            if(response.success){
                message.success(response.message)
                getData()
            }else{
                message.error(response.message)
            }
            dispatch(HideLoading())
        }catch (err){
            dispatch(HideLoading())
            message.error(err.message)
        }
    }
    const columns = [
        {title:"Name",dataIndex:"name",key:"name"},
        {title:"Address",dataIndex:"address",key:"address"},
        {title:"Owner",dataIndex:"owner",render:(text,data) => {if(data.owner) return data.owner.name}},
        {title:"Phone Number",dataIndex:"phone",key:"phone"},
        {title:"Email",dataIndex:"email",key:"email"},
        {title:"Status",dataIndex:"status",key:"status",render: (status,data) => {
            if(data.isActive){return "Approved"}else{return "Pending/Blocked"}}},
        {title:"Actions",dataIndex:"actions",
            render: (text,data) => {
            return (
                <>
                <Button onClick={() => handleStatusChange(data)}>{data.isActive?"Block":"Approve"}</Button>
                </>
            )
            }
        } 
        ]
    const getData = async () => {
        dispatch(ShowLoading())
        const response = await getAllTheatres()
        const allTheatres = response.data
        setTheatres(allTheatres.map((item) => {return {...item,key:`theatre_${item._id}`}})) 
        dispatch(HideLoading())
    }
    useEffect(() => {
        getData()
    }, [])
    return (
        <div>
            <Table dataSource={theatres} columns={columns} tableLayout="fixed"/>
        </div>
    )
}
export default TheatreTable 