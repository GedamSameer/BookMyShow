import { Tabs } from "antd"
import MovieList from "./MovieList"
import TheatreTable from "./TheatreTable"

function Admin(){
    const tabItems = [
        {
            key:"1",
            label : "Movies",
            children : <MovieList/>
        },
        {
            key:"2",
            label : "Theatres",
            children : <TheatreTable/>
        }
    ]
    return(
        <>
        <div>
            <h1>Admin page</h1>
            <Tabs items={tabItems} />
        </div>
        </>
        
    )
}
export default Admin