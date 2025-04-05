import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { HideLoading, ShowLoading } from "../../redux/loaderSlice"
import { Col, Input, message, Row } from "antd"
import { getAllTheatresByMovie } from "../../apicalls/shows"
import { getMovieById } from "../../apicalls/movies"
import {useNavigate, useSearchParams,useParams} from "react-router-dom"
import {CalendarOutlined} from "@ant-design/icons"
import moment from "moment"

const Movie = () => {
    const [searchParms] = useSearchParams()
    const params = useParams()
    const [movie,setMovie] = useState(null)
    const [theatres,setTheatres] = useState([])
    const [date,setDate] = useState(moment(searchParms.get("date")).format("YYYY-MM-DD"))
    const dispatch = useDispatch()
    const navgiate = useNavigate()
    const getData = async () => {
        try{
            dispatch(ShowLoading())
            const response = await getMovieById(params.id)
            if(response.success){
                setMovie(response.data)
            }else{
                message.error(response.message)
            }
            dispatch(HideLoading())
        }catch(err){
            dispatch(HideLoading())
            message.error(err.message)
        }
    }
    const getAllTheatres = async () => {
        try{
            dispatch(ShowLoading())
            const response = await getAllTheatresByMovie(params.id,date)
            if(response.success){
                setTheatres(response.data)
            }else{
                message.error(response.message)
            }
            dispatch(HideLoading())
        }catch(err){
            dispatch(HideLoading())
            message.error(err.message)
        }
    }
    const handleDate = (e) => {
        setDate(moment(e.target.value).format("YYYY-MM-DD"))
        navgiate(`/movie/${params.id}?date=${e.target.value}`)
    }
    useEffect(() => {getData()},[])
    useEffect(() => {getAllTheatres()},[date])
    return (
        <>
        <div>
            {movie && (
                <div style={{display:"flex", flexDirection:"row",gap:"20px"}}>
                    <div>
                        <img src={movie.poster} width={150} alt="Movie Poster" />
                        <h1>{movie.movieName}</h1>
                    </div>
                    <div>
                        <p>Language: <span>{movie.language}</span></p>
                        <p>Genre: <span>{movie.genre}</span></p>
                        <p>Release Date: {" "} <span>{moment(movie.date).format("DD MMM YYYY")}</span></p>
                        <p>Duration : <span>{movie.duration} Mins</span></p>
                        <hr />
                        <div>
                            <label>Choose the date: </label>
                            <Input onChange={handleDate} type="date" value={date} prefix={<CalendarOutlined />} />
                        </div>
                    </div>
                </div>
            )}
            {theatres.length === 0 && (<div><h2>Currently, no theatres are available for this movie!</h2></div>)}
            {theatres.length > 0 && (
            <div>
                <h2>Theatres</h2>{theatres.map((theatre) => (
                    <div key={theatre._id} style={{border:"1px solid #e0e0e0",borderRadius:"8px",margin:"8px"}}>
                    <Row gutter={24} key={theatre._id}>
                        <Col xs={{span:24}} lg={{span:8}}>
                        <h3>{theatre.name}</h3>
                        <p>{theatre.address}</p>
                        </Col>
                        <Col xs={{span:24}} lg={{span:16}}>
                        <div style={{display:"flex",flexWrap:"wrap",gap:"8px"}}>
                            {theatre.shows.sort((a,b) => moment(a.time,"HH:mm") - moment(b.time,"HH:mm")).map((singleShow) => 
                            { return <div key={singleShow._id} style={{border:"1px solid #1890ff",borderRadius:"4px",margin:"8px 4px",padding:"4px 8px",cursor:"pointer",}} 
                            onClick={()=> navgiate(`/book-show/${singleShow._id}`)}>{moment(singleShow.time,"HH:mm").format("hh:mm A")}</div>}) }
                        </div>
                        </Col>
                    </Row>
                    </div>
                ))}
            </div>
            ) }
        </div>
        </>
    )
}
export default Movie