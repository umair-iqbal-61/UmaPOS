import { Routes, Route } from "react-router-dom"
import Signup from "./pages/SignUp"
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from "./pages/Dashboard"
import Sell from "./pages/Sell"

function App() {

  return (
    <>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRole="admin"><Dashboard /></ProtectedRoute>
        } />
        <Route path="/sell" element={
          <ProtectedRoute allowedRole="cashier"><Sell /></ProtectedRoute>
        } />
      </Routes>
    </>
  )
}

export default App
