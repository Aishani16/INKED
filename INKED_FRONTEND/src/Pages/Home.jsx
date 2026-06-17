import Navbar from '../Components/Navbar.jsx'
import Footer from '../Components/Footer.jsx'
import HeroSection from '../Components/HeroSection.jsx'
import FeatureCard from '../Components/FeatureCard.jsx'
import CTASection from '../Components/CTASection.jsx'

const features = [
  { emoji: '✦', title: 'AI Writing Assistant', description: "Generate ideas, improve clarity, and beat writer's block with a built-in AI co-writer.", accent: true },
  { emoji: '📝', title: 'Rich Text Editor', description: 'Format your content with headings, images, code blocks, quotes and more — all in one place.' },
  { emoji: '💾', title: 'Auto-Save Drafts', description: 'Never lose your work. Inked saves your drafts automatically as you type.' },
  { emoji: '🔍', title: 'SEO Optimisation', description: 'Built-in SEO hints help your posts rank higher with meta tags and readability scores.', accent: true },
  { emoji: '🔒', title: 'Secure Authentication', description: 'JWT-based auth keeps your account safe. Passwords are never stored in plain text.' },
  { emoji: '📊', title: 'Analytics Dashboard',description: 'Track views, read time, and reader growth for every article you publish.' },
  { emoji: '🚀', title: 'Publishing Workflow',description: 'Draft → Review → Publish in one click. Schedule posts or publish instantly.' },
  { emoji: '🗂️', title: 'Content Management', description: 'Organise all your posts in one place. Filter by status, tags, or date.' },
]

const steps = [
  { emoji: '✍️', step: '01', title: 'Write',description: 'Open the editor and start writing. Use our distraction-free interface to stay in flow.' },
  { emoji: '⚡', step: '02', title: 'Enhance', description: 'Let the AI assistant improve grammar, suggest edits, and optimise your content for SEO.' },
  { emoji: '🌐', step: '03', title: 'Publish', description: 'Hit publish and share with the world. Track performance in real time on your dashboard.' },
]

export default function Home() {
  return (
    <div className="page-bg">
      <Navbar />

      
      <HeroSection />

      
      <section className="py-20 px-5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span
              className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4"
              style={{ background: 'rgba(33,150,188,0.12)', color: '#1a6080' }}
            >
              Everything you need
            </span>
            <h2
              className="text-4xl mb-4"
              style={{ fontFamily: "'DM Serif Display', serif", color: '#0f2a35' }}
            >
              Powerful Features
            </h2>
            <p className="max-w-md mx-auto text-base leading-relaxed" style={{ color: '#4a6a77' }}>
              Built specifically for bloggers and content creators who want to
              write, grow, and publish without distractions.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map(f => <FeatureCard key={f.title} {...f} />)}
          </div>
        </div>
      </section>

      
      <section className="py-20 px-5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span
              className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4"
              style={{ background: 'rgba(33,150,188,0.12)', color: '#1a6080' }}
            >
              Simple workflow
            </span>
            <h2
              className="text-4xl mb-4"
              style={{ fontFamily: "'DM Serif Display', serif", color: '#0f2a35' }}
            >
              How It Works
            </h2>
            <p style={{ color: '#4a6a77' }}>From blank page to published post in three simple steps.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {steps.map(({ emoji, step, title, description }) => (
              <div
                key={step}
                className="rounded-2xl p-7 text-center"
                style={{
                  background: 'rgba(255,255,255,0.65)',
                  border: '1px solid rgba(255,255,255,0.90)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  boxShadow: '0 2px 12px rgba(26,96,128,0.07)',
                }}
              >
                <p className="text-xs font-bold tracking-widest mb-4" style={{ color: '#7a9aa8' }}>
                  STEP {step}
                </p>
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4"
                  style={{ background: 'linear-gradient(135deg, #2196bc, #1a6080)' }}
                >
                  {emoji}
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: '#0f2a35' }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#4a6a77' }}>{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      
      <CTASection />

      <Footer />
    </div>
  )
}
