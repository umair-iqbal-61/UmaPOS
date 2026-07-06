import { Routes, Route, Navigate } from "react-router-dom"
import Signup from "./pages/Signup"
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from "./pages/Dashboard"
import Sell from "./pages/Sell"
import Inventory from './pages/Inventory'

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/signup" element={<Signup />} />
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
