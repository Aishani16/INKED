import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import api from '../services/api'
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";


export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.email || !form.password) {
      setError('Please fill in all fields.')
      return
    }
    // connect to backend auth endpoint
    try {

  const response = await api.post("/auth/login", {
    email: form.email,
    password: form.password
  })

  console.log(response.data)

  localStorage.setItem(
    "token",
    response.data.token
  )
  localStorage.setItem(
  "username",
  response.data.username
)

toast.success("Login successful!")
  navigate("/dashboard")

} catch (error) {

  setError(
    error.response?.data?.message ||
    "Login failed"
  )

  }
  }
  async function handleGoogleSuccess(credentialResponse) {
  try {

    const response = await api.post("/auth/google", {
      credential: credentialResponse.credential,
    });

    localStorage.setItem(
      "token",
      response.data.token
    );

    localStorage.setItem(
      "username",
      response.data.username
    );

    toast.success("Google login successful!");

    navigate("/dashboard");

  } catch (error) {

    toast.error(
      error.response?.data?.message ||
      "Google login failed"
    );

  }
}

  // Shared input style
  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    fontSize: '14px',
    background: 'rgba(255,255,255,0.70)',
    border: '1px solid rgba(33,150,188,0.20)',
    borderRadius: '10px',
    color: '#0f2a35',
    outline: 'none',
  }

  return (
    
    <div
      className="min-h-screen flex items-center justify-center px-5 py-12"
      style={{ background: 'linear-gradient(155deg, #eef8fb 0%, #d7f1f6 45%, #c2eaf3 100%)' }}
    >
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #2196bc, #1a6080)' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            </div>
            <span className="text-xl font-semibold" style={{ fontFamily: "'DM Serif Display', serif", color: '#1b4257' }}>
              Inked
            </span>
          </Link>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8"
          style={{
            background: 'rgba(255,255,255,0.68)',
            border: '1px solid rgba(255,255,255,0.92)',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            boxShadow: '0 8px 40px rgba(26,96,128,0.12)',
          }}
        >
          <h1
            className="text-2xl mb-1"
            style={{ fontFamily: "'DM Serif Display', serif", color: '#0f2a35' }}
          >
            Welcome back
          </h1>
          <p className="text-sm mb-7" style={{ color: '#4a6a77' }}>
            Log in to continue writing your next great post.
          </p>

          {/* Error message */}
          {error && (
            <div
              className="text-sm px-4 py-3 rounded-xl mb-5"
              style={{ background: 'rgba(255,80,80,0.10)', color: '#b02020', border: '1px solid rgba(255,80,80,0.18)' }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: '#4a6a77' }}>
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                style={inputStyle}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: '#4a6a77' }}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  style={{ ...inputStyle, paddingRight: '44px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium"
                  style={{ color: '#7a9aa8' }}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {/* Forgot */}
            <div className="text-right">
              <a href="#" className="text-xs hover:underline" style={{ color: '#2196bc' }}>
                Forgot password?
              </a>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90 mt-2"
              style={{ background: 'linear-gradient(135deg, #2196bc, #1a6080)' }}
            >
              Log In →
            </button>
            <div className="my-5 flex items-center">
  <div className="flex-1 h-px bg-gray-300"></div>
  <span className="px-3 text-xs text-gray-500">OR</span>
  <div className="flex-1 h-px bg-gray-300"></div>
</div>

<div className="flex justify-center">
  <GoogleLogin
    onSuccess={handleGoogleSuccess}
    onError={() => {
      toast.error("Google login failed");
    }}
  />
</div>
          </form>

          <p className="text-sm text-center mt-6" style={{ color: '#4a6a77' }}>
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold hover:underline" style={{ color: '#2196bc' }}>
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
