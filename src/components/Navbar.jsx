import { Link } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { supabase } from '../lib/supabase'

export default function Navbar() {
  const { role } = useAuth()
  return (
    <nav className="bg-gray-900 text-white px-4 py-3 flex gap-4 items-center">
      <span className="font-bold">UmaPOS</span>
      {role === 'admin' && <Link to="/dashboard">Dashboard</Link>}
      {role === 'admin' && <Link to="/inventory">Inventory</Link>}
      <Link to="/sell">Sell</Link>
      <button onClick={() => supabase.auth.signOut()} className="ml-auto text-red-400">Logout</button>
    </nav>
  )
}