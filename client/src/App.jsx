import "./App.css"
import ProtectedRoute from "./components/ProtectedRoute"
import Home from "./pages/home"
import Partner from './pages/Partner'
import Login from "./pages/login"
import Register from "./pages/register"
import {BrowserRouter, Routes, Route} from "react-router-dom"
import Admin from "./pages/Admin"
import Profile from "./pages/Profile"
import Movie from "./pages/Movie"
import BookShow from "./pages/BookShow"
import Reset from "./pages/Reset"
import Forgot from "./pages/ForgotPass"

function App() {
  return(
    <div>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/book-show/:showId" element={<ProtectedRoute><BookShow /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
        <Route path="/partner" element={<ProtectedRoute><Partner /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/movie/:id" element={<ProtectedRoute><Movie /></ProtectedRoute>} />
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/reset" element={<Reset />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      </BrowserRouter>
    </div>
  )
}
export default App