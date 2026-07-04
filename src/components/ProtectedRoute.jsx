import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

export default function ProtectedRoute({ children, allowedRole }) {
  const { user, role, loading } = useAuth()

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  if (!user) return <Navigate to="/login" replace />
  if (allowedRole && role !== allowedRole) return <Navigate to="/login" replace />

  return children
}