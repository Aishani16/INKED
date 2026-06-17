import { Link } from 'react-router-dom'

export default function CTASection() {
  return (
    <section className="py-20 px-5">
      <div className="max-w-3xl mx-auto text-center">
        <div
          className="rounded-3xl px-8 py-16"
          style={{
            background: 'linear-gradient(135deg, #0f2a35 0%, #1a6080 60%, #2196bc 100%)',
            boxShadow: '0 24px 64px rgba(26,96,128,0.30)',
          }}
        >
          <span
            className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-6"
            style={{ background: 'rgba(255,255,255,0.15)', color: '#b0e4ef' }}
          >
            Get Started Today - It's Free!
          </span>

          <h2
            className="text-4xl sm:text-5xl text-white mb-5"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            Ready to start writing?
          </h2>

          <p className="text-lg mb-8 max-w-md mx-auto leading-relaxed" style={{ color: '#b0e4ef' }}>
            Join thousands of creators publishing their best work on Inked.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm hover:opacity-90"
              style={{ background: 'white', color: '#0f2a35' }}
            >
              Create Your Free Account 
            </Link>
            <Link
              to="/blog/intro"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm text-white hover:bg-white/10"
              style={{ border: '1px solid rgba(255,255,255,0.30)' }}
            >
              See Sample Posts
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
