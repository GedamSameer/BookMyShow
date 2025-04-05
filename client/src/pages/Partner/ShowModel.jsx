import { Button, Form, message, Modal, Table, Row, Col, Input, Select  } from "antd"
import { ShowLoading,HideLoading } from "../../redux/loaderSlice"
import {EditOutlined,DeleteOutlined, ArrowLeftOutlined} from '@ant-design/icons'
import {getAllMovies} from "../../apicalls/movies"
import {addShow, deleteShow, getShowsByTheatre, updateShow} from "../../apicalls/shows"
import { useEffect, useState } from "react"
import {useDispatch} from "react-redux"
import moment from "moment"

const ShowModal = ({selectedTheatre,isShowModalOpen,setIsShowModalOpen}) => {
    const [view,setView] = useState("table")
    const [movies,setMovies] = useState(null)
    const [selectedMovie,setSelectedMovie] = useState(null)
    const [shows,setShows] = useState(null)
    const [selectedShow,setSelectedShow] = useState(null)
    const dispatch = useDispatch()
    const columns = [
        {title:"Show Name",dataIndex:"name",key:"name"},
        {title:"Show Date",dataIndex:"date",key:"date",render: (text,data) => {return moment(text).format("MM DD YYYY")}},
        {title:"Show Time",dataIndex:"time",key:"time",render: (text,data) => {return moment(text,"HH:mm").format("hh:mm A")}},
        {title:"Movie",dataIndex:"movie",key:"movie",render: (text,data) => {return data.movie.movieName}},
        {title:"Ticket Price",dataIndex:"ticketPrice",key:"ticketPrice",render: (text,data) => {return `Rs ${data.ticketPrice}`}},
        {title:"Total Seats",dataIndex:"totalSeats",key:"totalSeats"},
        {title:"Available Seats",dataIndex:"availableSeats",key:"availableSeats",render: (text,data) => {return data.totalSeats - data.bookedSeats.length}},
        {title:"Action", dataIndex:"action",key:"action",render: (text,data) => {
            return(
                <div>
                    <Button onClick={() => {
                        setView("edit")
                        setSelectedMovie(data.movie)
                        setSelectedShow({...data,date:moment(data.date).format("YYYY-MM-DD")})
                    }}><EditOutlined /></Button>
                    <Button onClick={() => handleDelete(data._id)}><DeleteOutlined /></Button>
                    {data.isActive && (
                        <Button onClick={() => {setIsShowModalOpen(true)}}>+ Shows</Button>
                    )}
                </div>
            )
            }
        }
    ]
    const handleDelete = async (showId) => {
        try{
            dispatch(ShowLoading())
            const response = await deleteShow(showId)
            if(response.success){
                message.success(response.message)
                getData()
            }else{
                message.error(response.message)
            }
            dispatch(HideLoading())
        }catch (err){

        }
    }
    const onFinish = async (values) => {
        try{
            dispatch(ShowLoading())
            let response = null
            if(view === "form"){
                response = await addShow({...values, theatre: selectedTheatre._id})
            }else{
                response = await updateShow(selectedShow._id,{...values, theatre: selectedTheatre._id})
            }
            if(response.success){
                getData()
                message.success(response.message)
                setView("table")
            }else{
                message.error(response.message)
            }
            dispatch(HideLoading())
        }catch (err){
            message.error(err.message)
            dispatch(HideLoading())
        }
    }
    const getData = async () => {
        try{
            dispatch(ShowLoading())
            const movieResponse = await getAllMovies()
            if(movieResponse.success){
                setMovies(movieResponse.data)
            }else{
                message.error(movieResponse.message)
            }
            const showResponse = await getShowsByTheatre(selectedTheatre._id)
            if(showResponse.success){
                setShows(showResponse.data)
            }else{
                message.error(showResponse.message)
            }
            dispatch(HideLoading())
        }catch (err){
            message.error(err.message)
            dispatch(HideLoading())
        }
    }
    useEffect(() => {
        getData()
    },[])
    return (
        <Modal title={selectedTheatre.name} footer={null} width={1200} open={isShowModalOpen} onCancel={() => setIsShowModalOpen(false)}>
        <div>
            <h3>{view === "table" ? "List of Shows" : view === "form" ? "Add Show" : "Edit Show"}</h3>
            {view === "table" && (<Button type="primary" onClick={() => {setView("form")}}>Add Show</Button>)}
        </div>
        {view === "table" && (<Table dataSource={shows} rowKey={"_id"} columns={columns} />)}
        {(view === "form" || view === "edit") && (
            <Form layout="vertical"  initialValues={view === "edit" ? selectedShow : null} onFinish={onFinish}>
                <Row gutter={{xs:6,sm:10,md:12,lg:16}}>
                    <Col span={24}>
                        <Row gutter={{xs:6,sm:10,md:12,lg:16}}>
                            <Col span={8}>
                            <Form.Item label="Show Name" htmlFor="name" name="name" rules={[{required:true,message:"Show Name is required"}]}>
                                <Input id="name" type="text" placeholder="Enter the Show Name" />
                            </Form.Item>
                            </Col>
                            <Col span={8}>
                            <Form.Item label="Show Date" htmlFor="date" name="date" rules={[{required:true,message:"Show Date is required"}]}>
                                <Input id="date" type="date" placeholder="Enter the Show Date" />
                            </Form.Item>
                            </Col>
                            <Col span={8}>
                            <Form.Item label="Show Time" htmlFor="time" name="time" rules={[{required:true,message:"Show Time is required"}]}>
                                <Input id="time" type="time" placeholder="Enter the Show Time" />
                            </Form.Item>
                            </Col>
                        </Row>
                    </Col>
                    <Col span={24}>
                        <Row gutter={{xs:6,sm:10,md:12,lg:16}}>
                            <Col span={8}>
                            <Form.Item label="Select the Movie" htmlFor="movie" name="movie" rules={[{required:true,message:"Movie is required"}]}>
                                <Select id="movie" placeholder="Select Movie" defaultValue={selectedMovie && selectedMovie.title} 
                                options={movies.map((movie) => ({key: movie._id, value: movie._id, label: movie.movieName}))} />
                            </Form.Item>
                            </Col>
                            <Col span={8}>
                            <Form.Item label="Ticket Price" htmlFor="ticketPrice" name="ticketPrice" rules={[{required:true,message:"Ticket Price is required"}]}>
                                <Input id="ticketPrice" type="number" placeholder="Enter the Ticket Price" />
                            </Form.Item>
                            </Col>
                            <Col span={8}>
                            <Form.Item label="Total Seats" htmlFor="totalSeats" name="totalSeats" rules={[{required:true,message:"Total Seats is required"}]}>
                                <Input id="totalSeats" type="number" placeholder="Enter the Total Seats" />
                            </Form.Item>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <div>
                    <Button htmlType="button" onClick={() => {setView("table")}}><ArrowLeftOutlined/> Go Back</Button>
                    <Button type="primary" htmlType="submit" >{view === "form" ? "Add the Show" : "Edit the Show"}</Button>
                </div>
            </Form>
        )}
        </Modal>
    )
}
export default ShowModal