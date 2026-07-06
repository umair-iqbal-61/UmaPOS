import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate, Link } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function handleLogin(e) {
    e.preventDefault()
    setError('')
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); return }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single()

    navigate(profile?.role === 'admin' ? '/dashboard' : '/sell')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-md w-80 space-y-4">
        <h1 className="text-xl font-bold text-center">UmaPOS Login</h1>
        <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Email" required
          className="w-full border rounded px-3 py-2" />
        <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" required
          className="w-full border rounded px-3 py-2" />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Log In
        </button>
        <p>Create new account: <Link className='text-blue-700' to='/signup'>SignUp</Link></p>
      </form>

    </div>
  )
}