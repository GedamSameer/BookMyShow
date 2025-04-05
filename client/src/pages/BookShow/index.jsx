import { Button, Card, Col, Divider, message, Row } from "antd"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { HideLoading, ShowLoading } from "../../redux/loaderSlice"
import { getShowById } from "../../apicalls/shows"
import { useNavigate, useParams } from "react-router-dom"
import moment from "moment"
import StripeCheckout from "react-stripe-checkout"
import { bookShow, makePayment } from "../../apicalls/booking"

const BookShow = () => {
    const [show,setShow] = useState()
    const [selectedSeats,setSelectedSeats] = useState([])
    const dispatch = useDispatch()
    const params = useParams()
    const navigate = useNavigate()
    const {user} = useSelector(state => state.user)

    const getData = async () => {
        try{
            dispatch(ShowLoading())
            const response = await getShowById(params.showId)
            if(response.success){
                setShow(response.data)
            }else{
                message.error(response.message)
            }
            dispatch(HideLoading())
        }catch (err){
            dispatch(HideLoading())
            message.error(err.message)
        }
    }
    const getSeats = () => {
        let columns = 10
        let totalSeats = show.totalSeats
        let rows = Math.ceil(totalSeats/columns)
        return (
            <div>
                <div style={{maxWidth:"800px"}}>
                    <div style={{backgroundColor:"slategray",color:"white",borderRadius:"64px 64px 0 0"}}>
                        <h3 >Screen this side you will be watching in this direction</h3>
                    </div>
                    <ul style={{listStyle:"none", display:"flex", flexWrap:"wrap",padding:"0",gap:"10px",justifyContent:"center",paddingTop:"100px"}}>
                        {Array.from(Array(rows).keys()).map((row) => 
                        Array.from(Array(columns).keys()).map((column) => {
                            let seatNumber = row*columns + column +1
                            let seatClass = " seat-btn"
                            if(selectedSeats.includes(seatNumber)){
                                seatClass += " selected"
                            }
                            if(show.bookedSeats.includes(seatNumber)){
                                seatClass += " booked"
                            }
                            if(seatNumber <= totalSeats){
                                return (
                                    <li key={seatNumber}>
                                        <button className={seatClass} 
                                        style={{width:"40px",height:"40px",padding:"0"}}
                                        onClick={() => {
                                            if(selectedSeats.includes(seatNumber)){
                                                setSelectedSeats(selectedSeats.filter(cur => cur!==seatNumber))
                                            }else{
                                                setSelectedSeats([...selectedSeats,seatNumber])
                                            }
                                        }}>{seatNumber}</button>
                                    </li>
                                )
                            }
                        })
                        )}
                    </ul>
                </div>
                <Divider />
                <div>
                    <div>Selected Seats : <span>{selectedSeats.join(", ")}</span></div>
                    <div>Total Price: {" "} <span><b>Rs. {selectedSeats.length * show.ticketPrice}</b></span></div>
                    <br></br>
                </div>
            </div>

        )
    }
    const bookSeatForUser = async (transactionId) => {
        try{
            dispatch(ShowLoading())
            const response = await bookShow({show:params.showId,transactionId,seats:selectedSeats,user:user})
            if(response.success){
                console.log(response)
                navigate("/profile")
            }else{
                console.error("Something went wrong",response)
            }
        }catch (err){
            dispatch(HideLoading())
            console.log(err)
        }
    }
    const onToken = async (Stripetoken) => {
        try{
            dispatch(ShowLoading())
            const response = await makePayment({token:Stripetoken,amount:selectedSeats.length * show.ticketPrice})
            console.log(response)
            if(response.success){
                bookSeatForUser(response.data)
            }
        }catch (err){
            console.log(err)
            dispatch(HideLoading())
        }
    }
    useEffect(() => {getData()},[])
    return (
        
        <>
        <style>
        {`
        .seat-btn {
            border: 1px solid #d9d9d9;
            border-radius: 4px;
            background: #fff;
            cursor: pointer;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .seat-btn:hover {
            background: #f5f5f5;
            border-color: #40a9ff;
        }
        .seat-btn.selected {
            background: #52c41a;
            color: white;
            border-color: #52c41a;
        }
        .seat-btn.booked {
            background: #ff4d4f;
            color: white;
            border-color: #ff4d4f;
            cursor: not-allowed;
            pointer-events: none;
        }
        `}
        </style>
        {show && (
            <Row gutter={24}>
                <Col span={24}>
                <Card 
                title={
                    <div >
                        <h1>{show.movie.movieName}</h1>
                        <p>Theatre: {show.theatre.name},</p><p> {show.theatre.address}</p>    
                    </div>
                }
                extra={
                        <div style={{display:"flex",flexDirection:"column",alignItems:"flex-start"}}>
                        <h3 style={{margin:"0",display:"flex",gap:"10px"}}><span>Show Name: </span> <span>{show.name}</span></h3>
                        <h3 style={{margin:"0",display:"flex",gap:"10px"}}><span>Date and Time: </span><span>{moment(show.date).format("DD MMM YYYY")} at {" "} {moment(show.time,"HH:mm").format("hh:mm A")}</span></h3>
                        <h3 style={{margin:"0",display:"flex",gap:"10px"}}><span>Ticket Price: </span><span> Rs. {show.ticketPrice} /-</span></h3>
                        <h3 style={{margin:"0",display:"flex",gap:"10px"}}><span>Total Seats: </span><span> {show.totalSeats} </span></h3>
                        <h3 style={{margin:"0",display:"flex",gap:"10px"}}><span>Available Seats: </span><span> {show.totalSeats - show.bookedSeats.length}</span></h3>
                    </div>
                }
                > 
                {getSeats()}
                {selectedSeats.length > 0 && (
                    <StripeCheckout token={onToken} billingAddress  amount={selectedSeats.length * show.ticketPrice} 
                    stripeKey="pk_test_51PjFid15NNu8pyhqAiMEJ6K8toK20sRSuY55qLtzQi0wo32lYeNZMuaTQ33RcD7a4UkhlmwP0HfD2CRoq6h3tHEs00m83J7Rxh"
                    >
                        <div><Button type="primary">Pay Now</Button></div>
                    </StripeCheckout>
                )}

                </Card>
                </Col>
            </Row>
        )}    
        </>
    )
}
export default BookShow