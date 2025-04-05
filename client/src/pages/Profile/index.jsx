import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { HideLoading, ShowLoading } from "../../redux/loaderSlice"
import { Button, Card, Col, message, Row } from "antd"
import { getAllBookings } from "../../apicalls/booking"
import moment from "moment"
import { Link } from "react-router-dom"

const Profile = () => {
    const dispatch = useDispatch()
    const [bookings,setBookings] = useState([])
    const {user} = useSelector(state => state.user)

    const getData = async () => {
        try{
            dispatch(ShowLoading())
            const response  = await getAllBookings(user)
            if(response.success){
                setBookings(response.data)
            }else{
                message.error(response.message)
            }
            dispatch(HideLoading())
        }catch (err){
            dispatch(HideLoading())
            message.error(err.message)
        }
    }
    useEffect(() => {getData()
        console.log(bookings)
    },[])
    return (
        <>
        {bookings.length >0 && (
            <Row gutter={24} >
                {bookings.map((booking) => {
                    return (
                        <Col key={booking._id} xs={{span:24}} lg={{span:12}}>
                            <Card>
                                <div style={{display:"flex", flexDirection:"row", gap:"30px"}}>
                                    <div>
                                        <img src={booking.show.movie.poster} width={100} alt="Movie Poster" />
                                    </div>
                                    <div style={{display:"flex", flexDirection:"column",alignItems:"flex-start"}}>
                                        <h3 style={{margin:0}}>{booking.show.movie.movieName}</h3>
                                        <p style={{margin:0}}>Theatre: <b>{booking.show.theatre.name}</b></p>
                                        <p style={{margin:0}}>Seats: <b>{booking.seats.join(", ")}</b></p>
                                        <p style={{margin:0}}>Date and Time: <b>{moment(booking.show.date).format("DD MMM YYYY")} at {moment(booking.show.time,"HH:mm").format("hh:mm A")}</b></p>
                                        <p style={{margin:0}}>Amount: <b>Rs. {booking.seats.length * booking.show.ticketPrice}</b></p>
                                        <p style={{margin:0}}>Booking Id: <b>{booking.transactionId}</b></p>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                    )
                })}
            </Row>
        )}
        {bookings.length === 0 && (
            <div>
                <h1>You have not booked any shows yet!</h1>
                <Link to="/"><Button type="primary">Start Booking</Button></Link>
            </div>
        )}
        </>
    )
}
export default Profile