import { Routes, Route } from "react-router-dom"
import SignUp from "./pages/SignUp"
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from "./pages/Dashboard"
import Sell from "./pages/Sell"
import Inventory from './pages/Inventory'

function App() {

  return (
    <>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRole="admin"><Dashboard /></ProtectedRoute>
        } />
        <Route path="/sell" element={
          <ProtectedRoute allowedRole="cashier"><Sell /></ProtectedRoute>
        } />
        <Route path="/inventory" element={
          <ProtectedRoute allowedRole="admin"><Inventory /></ProtectedRoute>
        } />
      </Routes>
    </>
  )
}

export default App
