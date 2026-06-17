import { Link } from 'react-router-dom'


function EditorMockup() {
  return (
    <div
      className="w-full rounded-2xl overflow-hidden"
      style={{
        background: 'rgba(255,255,255,0.88)',
        boxShadow: '0 24px 64px rgba(26,96,128,0.18)',
        border: '1px solid rgba(255,255,255,0.95)',
      }}
    >

  
      <div
        className="flex items-center gap-2 px-4 py-3"
        style={{
          background: 'rgba(238,248,251,0.95)',
          borderBottom: '1px solid rgba(33,150,188,0.10)',
        }}
      >
        <span className="w-3 h-3 rounded-full" style={{ background: '#ff5f57' }} />
        <span className="w-3 h-3 rounded-full" style={{ background: '#febc2e' }} />
        <span className="w-3 h-3 rounded-full" style={{ background: '#28c840' }} />
        <span className="ml-3 text-xs font-medium" style={{ color: '#7a9aa8' }}>inked.app/editor</span>
      </div>

      
      <div className="p-6">

       
        <div
          className="flex gap-1 mb-4 pb-3 flex-wrap"
          style={{ borderBottom: '1px solid rgba(33,150,188,0.10)' }}
        >
          {['B', 'I', 'U', 'H1', 'H2', '❝', '—'].map(t => (
            <button
              key={t}
              className="px-2.5 py-1 text-xs font-semibold rounded"
              style={{
                color: '#4a6a77',
                background: 'rgba(33,150,188,0.07)',
              }}
            >
              {t}
            </button>
          ))}
        
          <div className="ml-auto">
            <span
              className="text-xs font-semibold px-3 py-1 rounded-full text-white"
              style={{ background: 'linear-gradient(90deg, #2196bc, #1a6080)' }}
            >
               AI Assist
            </span>
          </div>
        </div>

       
        <p
          className="text-lg font-bold mb-2"
          style={{ fontFamily: "'DM Serif Display', serif", color: '#0f2a35' }}
        >
          The Future of Content Creation
        </p>

      
        <div className="flex gap-2 mb-4">
          {['#writing', '#ai', '#content'].map(tag => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ background: '#d7f1f6', color: '#2196bc' }}
            >
              {tag}
            </span>
          ))}
        </div>

       
        <div className="space-y-2 mb-4">
          {[100, 88, 95, 72].map((w, i) => (
            <div
              key={i}
              className="h-2.5 rounded-full"
              style={{ width: `${w}%`, background: 'rgba(33,150,188,0.12)' }}
            />
          ))}
          
          <div className="h-2.5 rounded-full" style={{ width: '80%', background: 'rgba(33,150,188,0.30)' }} />
          {[68, 85].map((w, i) => (
            <div
              key={i}
              className="h-2.5 rounded-full"
              style={{ width: `${w}%`, background: 'rgba(33,150,188,0.12)' }}
            />
          ))}
        </div>

       
        <div
          className="rounded-xl p-3 flex gap-2 mb-4"
          style={{
            background: 'rgba(33,150,188,0.07)',
            border: '1px solid rgba(33,150,188,0.18)',
          }}
        >
          <span className="text-sm">✦</span>
          <div>
            <p className="text-xs font-semibold mb-1" style={{ color: '#2196bc' }}>AI Suggestion</p>
            <div className="space-y-1">
              {[85, 60].map((w, i) => (
                <div key={i} className="h-2 rounded-full" style={{ width: `${w}%`, background: 'rgba(33,150,188,0.22)' }} />
              ))}
            </div>
          </div>
        </div>

        
        <div className="flex gap-4 text-xs" style={{ color: '#7a9aa8' }}>
          <span>342 words</span>
          <span>·</span>
          <span>~2 min read</span>
          <span>·</span>
          <span style={{ color: '#28c840', fontWeight: 600 }}>● Auto-saved</span>
        </div>
      </div>
    </div>
  )
}


export default function HeroSection() {
  const highlights = [
    { emoji: '✦', text: 'AI-assisted writing' },
    { emoji: '🚀', text: 'Seamless publishing' },
    { emoji: '🔒', text: 'Enterprise security' },
    { emoji: '📊', text: 'Audience analytics' },
  ]

  return (
    <section className="pt-28 pb-20 px-5">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          
          <div>
           
            <div className="inline-flex items-center gap-2 mb-6">
              <span
                className="text-xs font-semibold px-3 py-1.5 rounded-full"
                style={{
                  background: 'rgba(33,150,188,0.12)',
                  color: '#1a6080',
                  border: '1px solid rgba(33,150,188,0.22)',
                }}
              >
                 AI-powered blogging platform
              </span>
            </div>

            
            <h1
              className="text-5xl sm:text-6xl mb-5"
              style={{
                fontFamily: "'DM Serif Display', serif",
                color: '#0f2a35',
                lineHeight: 1.1,
              }}
            >
              Write What{' '}
              <span
                className="italic"
                style={{
                  background: 'linear-gradient(135deg, #2196bc, #1a6080)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Matters.
              </span>
            </h1>

           
            <p className="text-lg mb-8 leading-relaxed max-w-md" style={{ color: '#4a6a77' }}>
              Create, enhance, and publish beautiful articles with an AI writing
              assistant built for modern bloggers and content creators.
            </p>

            
            <div className="grid grid-cols-2 gap-3 mb-9">
              {highlights.map(({ emoji, text }) => (
                <div key={text} className="flex items-center gap-2.5">
                  <span className="text-base">{emoji}</span>
                  <span className="text-sm font-medium" style={{ color: '#1b4257' }}>{text}</span>
                </div>
              ))}
            </div>

            
            <div className="flex flex-wrap gap-3">
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #2196bc, #1a6080)' }}
              >
                Start Writing Free →
              </Link>
              <Link
                to="/blog/intro"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm hover:bg-white/60"
                style={{
                  color: '#1a6080',
                  background: 'rgba(255,255,255,0.50)',
                  border: '1px solid rgba(33,150,188,0.25)',
                }}
              >
                See a Sample Post
              </Link>
            </div>

            
            <div className="flex items-center gap-3 mt-8">
              <div className="flex -space-x-2">
                {['#2196bc', '#42b4d6', '#1a6080', '#7dcfe6'].map((bg, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                    style={{ background: bg }}
                  >
                    {['A', 'R', 'S', 'M'][i]}
                  </div>
                ))}
              </div>
              <p className="text-sm" style={{ color: '#4a6a77' }}>
                Join <strong style={{ color: '#0f2a35' }}>2,400+</strong> creators on Inked
              </p>
            </div>
          </div>

         
          <div className="relative">
          
            <div
              className="absolute -inset-8 rounded-3xl opacity-40 blur-3xl"
              style={{ background: 'radial-gradient(ellipse at center, #7dcfe6, transparent 70%)' }}
            />
            <div className="relative">
              <EditorMockup />



              <div
                className="absolute -top-4 -right-4 rounded-xl px-4 py-2.5 text-sm font-semibold flex items-center gap-2"
                style={{
                  background: 'rgba(255,255,255,0.95)',
                  boxShadow: '0 4px 20px rgba(26,96,128,0.14)',
                  color: '#0f2a35',
                }}
              >
                <span style={{ color: '#28c840' }}>↑</span> Reader growth +51%
              </div>

            

              <div
                className="absolute -bottom-4 -left-4 rounded-xl px-4 py-2.5 text-sm font-semibold flex items-center gap-2"
                style={{
                  background: 'rgba(255,255,255,0.95)',
                  boxShadow: '0 4px 20px rgba(26,96,128,0.14)',
                  color: '#0f2a35',
                }}
              >
                📊 +21 new readers today
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
