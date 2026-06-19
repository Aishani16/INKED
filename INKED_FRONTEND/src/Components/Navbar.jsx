import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

function PenIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  )
}

function MenuIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [role, setRole] = useState('')

  const { pathname } = useLocation()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const storedUsername = localStorage.getItem('username')
    const storedRole = localStorage.getItem('role')

    setIsLoggedIn(!!token)

    if (storedUsername) {
      setUsername(storedUsername)
    }
    if (storedRole) {
  setRole(storedRole)
}
  }, [pathname])

  function handleLogout() {

  const confirmed = window.confirm(
    "Are you sure you want to logout?"
  )

  if (!confirmed) {
    return
  }

  localStorage.removeItem("token")
  localStorage.removeItem("username")
  localStorage.removeItem("role")

  setIsLoggedIn(false)
  setUsername("")

  window.location.href = "/"
}

  function NavLink({ to, children }) {
    const isActive = pathname === to

    return (
      <Link
        to={to}
        onClick={() => setMenuOpen(false)}
        style={{
          color: isActive ? '#2196bc' : '#1b4257',
        }}
        className="text-sm font-medium hover:text-[#2196bc] transition-colors"
      >
        {children}
      </Link>
    )
  }

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: 'rgba(215, 241, 246, 0.72)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderBottom: '1px solid rgba(33, 150, 188, 0.12)',
      }}
    >
      <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #2196bc, #1a6080)',
            }}
          >
            <PenIcon />
          </div>

          <span
            className="text-lg font-semibold tracking-tight"
            style={{
              fontFamily: "'DM Serif Display', serif",
              color: '#1b4257',
            }}
          >
            Inked
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-7">
          <NavLink to="/">Home</NavLink>

          <NavLink to="/blogs">Blogs</NavLink>

          {isLoggedIn && (
            <NavLink to="/dashboard">
              Dashboard
            </NavLink>
          )}
          {role === "admin" && (
  <NavLink to="/admin">
    Admin Dashboard
  </NavLink>
)}

          <a
            href="#about"
            className="text-sm font-medium text-[#1b4257] hover:text-[#2196bc] transition-colors"
          >
            About
          </a>
        </nav>

        {/* DESKTOP AUTH */}
        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            <>
              

              <button
                onClick={handleLogout}
                className="text-sm font-medium px-3 py-1.5"
                style={{ color: '#1b4257' }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-[#1b4257] hover:text-[#2196bc] transition-colors px-3 py-1.5"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="text-sm font-semibold text-white px-4 py-1.5 rounded-lg hover:opacity-90"
                style={{
                  background:
                    'linear-gradient(135deg, #2196bc, #1a6080)',
                }}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          className="md:hidden p-1.5 rounded-lg text-[#1b4257] hover:bg-white/40"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {/* MOBILE DROPDOWN */}
      {menuOpen && (
        <div
          className="md:hidden px-5 py-4 flex flex-col gap-4"
          style={{
            borderTop: '1px solid rgba(33,150,188,0.12)',
          }}
        >
          <NavLink to="/">Home</NavLink>

          <NavLink to="/blogs">Blogs</NavLink>

          {isLoggedIn && (
            <NavLink to="/dashboard">
              Dashboard
            </NavLink>
          )}

          {role === "admin" && (
  <NavLink to="/admin">
    Admin Dashboard
  </NavLink>
)}

          <a
            href="#about"
            className="text-sm font-medium text-[#1b4257] hover:text-[#2196bc]"
          >
            About
          </a>

          <hr
            style={{
              borderColor: 'rgba(33,150,188,0.15)',
            }}
          />

          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="text-left text-sm font-medium text-[#1b4257]"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="text-sm font-medium text-[#1b4257]"
              >
                Login
              </Link>

              <Link
                to="/signup"
                onClick={() => setMenuOpen(false)}
                className="text-sm font-semibold text-white text-center py-2 rounded-lg"
                style={{
                  background:
                    'linear-gradient(135deg, #2196bc, #1a6080)',
                }}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  )
}
