import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

export default function Signup() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function handleSignup(e) {
    e.preventDefault()
    setError('')
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } }
    })
    if (error) setError(error.message)
    else navigate('/login')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <form onSubmit={handleSignup} className="bg-white p-8 rounded-lg shadow-md w-80 space-y-4">
        <h1 className="text-xl font-bold text-center">UmaPOS Signup</h1>
        <input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Full Name" required
          className="w-full border rounded px-3 py-2" />
        <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Email" required
          className="w-full border rounded px-3 py-2" />
        <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" required
          className="w-full border rounded px-3 py-2" />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Sign Up
        </button>
      </form>
    </div>
  )
}