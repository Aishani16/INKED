import { Link } from 'react-router-dom'

function PenIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  )
}

export default function Footer() {
  return (
    <footer style={{ background: '#0f2a35', color: 'white' }}>
      <div className="max-w-6xl mx-auto px-5 py-14">

        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">

          
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-3">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #2196bc, #42b4d6)' }}
              >
                <PenIcon />
              </div>
              <span className="text-lg font-semibold" style={{ fontFamily: "'DM Serif Display', serif" }}>
                Inked
              </span>
            </Link>
            <p className="text-sm leading-relaxed max-w-[180px]" style={{ color: '#7a9aa8' }}>
              Write What Matters.
            </p>
          </div>

          

          {/* PRODUCTS */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#7a9aa8' }}>
              Product
            </p>
            <ul className="space-y-2.5 text-sm" style={{ color: '#b0cdd8' }}>
              {[['/', 'Features'], ['/dashboard', 'Dashboard'], ['/editor', 'Editor']].map(([href, label]) => (
                <li key={label}>
                  <Link to={href} className="hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>



          {/* RESOURCES */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#7a9aa8' }}>
              Resources
            </p>
            <ul className="space-y-2.5 text-sm" style={{ color: '#b0cdd8' }}>
              {['Documentation', 'API Reference', 'Blog'].map(label => (
                <li key={label}><a href="#" className="hover:text-white transition-colors">{label}</a></li>
              ))}
            </ul>
          </div>



          {/* COMPANY */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#7a9aa8' }}>
              Company
            </p>
            <ul className="space-y-2.5 text-sm" style={{ color: '#b0cdd8' }}>
              {['Careers', 'Privacy Policy', 'Terms of Service'].map(label => (
                <li key={label}><a href="#" className="hover:text-white transition-colors">{label}</a></li>
              ))}
            </ul>
          </div>
        </div>

        
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8"
          style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
        >
          <p className="text-xs" style={{ color: '#7a9aa8' }}>
            © {new Date().getFullYear()} Inked. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm" style={{ color: '#7a9aa8' }}>
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">GitHub</a>
            <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
          </div>
        </div>

      </div>
    </footer>
  )
}
