export default function DashboardCard({ emoji, label, value, change, changePositive }) {
  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: 'rgba(255,255,255,0.65)',
        border: '1px solid rgba(255,255,255,0.90)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        boxShadow: '0 2px 12px rgba(26,96,128,0.07)',
      }}
    >
      <div className="flex items-start justify-between mb-3">
       
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-base"
          style={{ background: 'rgba(33,150,188,0.12)' }}
        >
          {emoji}
        </div>

        
        
        {change && (
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{
              background: changePositive ? 'rgba(40,200,64,0.12)' : 'rgba(255,80,80,0.12)',
              color:      changePositive ? '#1a7a30' : '#b02020',
            }}
          >
            {change}
          </span>
        )}
      </div>

      <p className="text-2xl font-bold mb-0.5" style={{ color: '#0f2a35' }}>{value}</p>
      <p className="text-xs font-medium" style={{ color: '#7a9aa8' }}>{label}</p>
    </div>
  )
}
