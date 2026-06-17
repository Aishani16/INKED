import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";


export default function Signup() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [showPw, setShowPw] = useState(false)
  const [errors, setErrors] = useState({})

   function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const newErrors = {}
    if (!form.name.trim()) newErrors.name = 'Name is required.'
    if (!form.email.trim()) {
  newErrors.email = 'Email is required.'
}
else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
  newErrors.email = 'Please enter a valid email address.'
}
    if (form.password.length < 8) newErrors.password  = 'Password must be at least 8 characters.'
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match.'

    if (Object.keys(newErrors).length) { setErrors(newErrors); return }
    //NEEDED FOR BACKEND
    try {

  const response = await api.post("/auth/signup", {
    username: form.name,
    email: form.email,
    password: form.password
  });

  console.log(response.data);

  toast.success("Account created successfully!");

    setTimeout(() => {
      navigate("/login");
      }, 1000);

  

} catch (error) {

  console.log(error);

  toast.error(
  error.response?.data?.message ||
  "Signup failed"
  );

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

    toast.success("Welcome to Inked!");

    navigate("/dashboard");

  } catch (error) {

    toast.error(
      error.response?.data?.message ||
      "Google signup failed"
    );

  }
}
  
  const strength = form.password.length === 0 ? 0 : form.password.length < 6 ? 1 : form.password.length < 10 ? 2 : 3
  const strengthColors = ['transparent', '#f44', '#febc2e', '#28c840']
  const strengthLabels = ['', 'Weak', 'Fair', 'Strong']

  const inputStyle = (hasError) => ({
    width: '100%',
    padding:'12px 16px',
    fontSize:'14px',
    background:'rgba(255,255,255,0.70)',
    border:`1px solid ${hasError ? '#f44' :'rgba(33,150,188,0.20)'}`,
    borderRadius:'10px',
    color:'#0f2a35',
    outline:'none',
  })

  return (
    <div
      className="min-h-screen flex items-center justify-center px-5 py-12"
      style={{ background: 'linear-gradient(155deg, #eef8fb 0%, #d7f1f6 45%, #c2eaf3 100%)' }}
    >
      <div className="w-full max-w-md">

        
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
          <h1 className="text-2xl mb-1" style={{ fontFamily: "'DM Serif Display', serif", color: '#0f2a35' }}>
            Create your account
          </h1>
          <p className="text-sm mb-7" style={{ color: '#4a6a77' }}>
            Start writing and sharing your ideas with the world.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: '#4a6a77' }}>Full Name</label>
              <input type="text" name="name" value={form.name} onChange={handleChange}
                placeholder="Hermione Granger" style={inputStyle(!!errors.name)} />
              {errors.name && <p className="text-xs mt-1" style={{ color: '#f44' }}>{errors.name}</p>}
            </div>

            
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: '#4a6a77' }}>Email Address</label>
              <input type="email" name="email" value={form.email} onChange={handleChange}
                placeholder="you@example.com" style={inputStyle(!!errors.email)} />
              {errors.email && <p className="text-xs mt-1" style={{ color: '#f44' }}>{errors.email}</p>}
            </div>

            
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: '#4a6a77' }}>Password</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} name="password" value={form.password}
                  onChange={handleChange} placeholder="Min. 8 characters"
                  style={{ ...inputStyle(!!errors.password), paddingRight: '44px' }} />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium"
                  style={{ color: '#7a9aa8' }}>
                  {showPw ? 'Hide' : 'Show'}
                </button>
              </div>

              
              {form.password.length > 0 && (
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="flex gap-1">
                    {[1, 2, 3].map(n => (
                      <div key={n} className="h-1 w-10 rounded-full transition-all"
                        style={{ background: n <= strength ? strengthColors[strength] : 'rgba(33,150,188,0.15)' }} />
                    ))}
                  </div>
                  <span className="text-xs font-medium" style={{ color: strengthColors[strength] }}>
                    {strengthLabels[strength]}
                  </span>
                </div>
              )}
              {errors.password && <p className="text-xs mt-1" style={{ color: '#f44' }}>{errors.password}</p>}
            </div>

            
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: '#4a6a77' }}>Confirm Password</label>
              <input type={showPw ? 'text' : 'password'} name="confirmPassword"
                value={form.confirmPassword} onChange={handleChange}
                placeholder="Re-enter password" style={inputStyle(!!errors.confirmPassword)} />
              
              {form.confirmPassword && form.password === form.confirmPassword && (
                <p className="text-xs mt-1 font-semibold" style={{ color: '#28c840' }}>✓ Passwords match</p>
              )}
              {errors.confirmPassword && <p className="text-xs mt-1" style={{ color: '#f44' }}>{errors.confirmPassword}</p>}
            </div>

            
            <button
              type="submit"
              className="w-full py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90 mt-2"
              style={{ background: 'linear-gradient(135deg, #2196bc, #1a6080)' }}
            >
              Create Account 
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
      toast.error("Google signup failed");
    }}
  />
</div>
          </form>

          <p className="text-xs text-center mt-4" style={{ color: '#7a9aa8' }}>
            By signing up you agree to our{' '}
            <a href="#" className="hover:underline" style={{ color: '#2196bc' }}>Terms</a> and{' '}
            <a href="#" className="hover:underline" style={{ color: '#2196bc' }}>Privacy Policy</a>.
          </p>

          <p className="text-sm text-center mt-5" style={{ color: '#4a6a77' }}>
            Already have an account?{' '}
            <Link to="/login" className="font-semibold hover:underline" style={{ color: '#2196bc' }}>Log in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
