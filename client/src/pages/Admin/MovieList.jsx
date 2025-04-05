import { Button, Table } from "antd"
import {useDispatch} from "react-redux"
import { useEffect, useState } from "react"
import {EditOutlined,DeleteOutlined} from "@ant-design/icons"
import {HideLoading, ShowLoading} from "../../redux/loaderSlice"
import {getAllMovies} from "../../apicalls/movies"
import MovieForm from "./MovieForm"
import DeleteMovieModal from './DeleteMovie'
import moment from "moment"

function MovieList(){
    const [isModalOpen,setIsModalOpen] = useState(false)
    const [movies,setMovies] = useState([])
    const [selectedMovie,setSelectedMovie] = useState(null)
    const [formType,setFormType] = useState("add")
    const [isDeleteModalOpen,setIsDeleteModalOpen] = useState(false)
    const dispatch = useDispatch()
    const tableHeadings = [
        {title:"Poster",dataIndex:"poster",render: (text) => <img src={text} alt="Movie Poster" style={{ width: 100, height: 150 }} />},
        {title:"Movie Name",dataIndex:"movieName"},
        {title:"Description",dataIndex:"description",width:200},
        {title:"Duration",dataIndex:"duration"},
        {title:"Genre",dataIndex:"genre"},
        {title:"Language",dataIndex:"language"},
        {title:"Release Date",dataIndex:"releaseDate",render: (text) => moment(text).format('DD MMM YYYY')},
        {title:"Actions",
            render: (text,data) => {
                return (
                    <div style={{display:"flex",gap:"1px"}}>
                        <Button onClick={() => {
                                                setIsModalOpen(true)
                                                setSelectedMovie(data)
                                                setFormType("edit")
                                               }}>
                            <EditOutlined/>
                        </Button>
                        <Button onClick={() => {
                                                setSelectedMovie(data)
                                                setIsDeleteModalOpen(true)
                                                }}>
                            <DeleteOutlined/>
                        </Button>
                    </div>
                )
            }
        },
    ]
    const getData = async () => {
        dispatch(ShowLoading())
        const response = await getAllMovies()
        console.log(response)
        const allMovies = response.data
        setMovies(allMovies.map((item) => {
            return {...item,key:`movie_${item._id}`}
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
                }}>Add Movie</Button>
                </div>
            <Table dataSource={movies} columns={tableHeadings} tableLayout="fixed"/>
            {isModalOpen &&
                <MovieForm setIsModalOpen={setIsModalOpen} selectedMovie={selectedMovie} setSelectedMovie={setSelectedMovie} formType={formType} getData={getData} />
            }
            {
                isDeleteModalOpen && 
                <DeleteMovieModal isDeleteModalOpen={isDeleteModalOpen} setIsDeleteModalOpen={setIsDeleteModalOpen} selectedMovie={selectedMovie} setSelectedMovie={setSelectedMovie} getData={getData} />
            }
        </div>
    )
}
export default MovieList