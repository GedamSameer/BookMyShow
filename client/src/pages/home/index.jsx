import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { HideLoading, ShowLoading } from "../../redux/loaderSlice"
import { getAllMovies } from "../../apicalls/movies"
import { Col, Input, Row } from "antd"
import {SearchOutlined} from "@ant-design/icons"
import moment from "moment"

function Home(){
    const [movies,setMovies] = useState([])
    const [searchText,setSearchText] = useState("")
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const getData = async () => {
        try{
            dispatch(ShowLoading())
            const response = await getAllMovies()
            if(response.success){
                setMovies(response.data)
            }else{
                setMovies(null)
            }
            dispatch(HideLoading())
        }catch(err){
            dispatch(HideLoading())
        }
    }
    const handleSearch = (e) => {
        setSearchText(e.target.value)
    }
    const redirectToMovies = (movieId) => {navigate(`/movie/${movieId}?date=${moment().format("YYYY-MM-DD")}`)}
    useEffect(() => {
        getData()
    },[])
    return(
        <>
            <Row>
                <Col xs={{span:24}} lg={{span:12}}>
                <Input placeholder="Type here to search for movies" onChange={handleSearch} prefix={<SearchOutlined />} />
                </Col>
            </Row><br></br>
            <Row gutter={{xs:8,sm:16,md:24,lg:32}}>
                {movies && movies.filter((movie) => movie.movieName.toLowerCase().includes(searchText.toLowerCase()))
                .map((movie) => { return <Col key={movie._id} span={{xs:24,sm:24,md:12,lg:10}}>
                    <div>
                        <img src={movie.poster} alt="Movie Poster" width={200} style={{borderRadius: "8px"}} onClick={() => redirectToMovies(movie._id)} />
                        <h3 onClick={() => redirectToMovies(movie._id)} style={{cursor:"pointer"}}>{movie.movieName}</h3>
                    </div>
                </Col>})}
            </Row>
                </>
        
    )
}
export default Home