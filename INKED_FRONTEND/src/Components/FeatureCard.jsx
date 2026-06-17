export default function FeatureCard({ emoji, title, description, accent = false }) {
  return (
    <div
      className="rounded-2xl p-6 transition-all hover:-translate-y-1"
      style={{
        background: accent
          ? 'linear-gradient(135deg, rgba(33,150,188,0.13), rgba(26,96,128,0.07))'
          : 'rgba(255,255,255,0.65)',
        border: '1px solid rgba(255,255,255,0.90)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        boxShadow: '0 2px 12px rgba(26,96,128,0.07)',
      }}
    >
      

      
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 text-lg"
        style={{ background: accent ? 'linear-gradient(135deg,#2196bc,#1a6080)' : 'rgba(33,150,188,0.12)' }}
      >
        {emoji}
      </div>

      <h3 className="text-base font-semibold mb-2" style={{ color: '#0f2a35' }}>
        {title}
      </h3>
      <p className="text-sm leading-relaxed" style={{ color: '#4a6a77' }}>
        {description}
      </p>
    </div>
  )
}
