import { Link } from 'react-router-dom'

export default function BlogCard({ title, excerpt, author, date, readTime, tags = [], slug, status }) {
  // STATUS_TAGS-COLORS
  const statusStyle = status === 'Published'
    ? { background: 'rgba(40,200,64,0.12)', color: '#1a7a30' }
    : { background: 'rgba(254,188,46,0.15)', color: '#9a6800' }

    const excerptText =
  typeof excerpt === "string"
    ? excerpt
    : excerpt?.blocks
        ?.map((block) => {
          if (block.data?.text) return block.data.text;
          if (Array.isArray(block.data?.items))
            return block.data.items.join(" ");
          return "";
        })
        .join(" ")
        .trim();

  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-3 transition-all hover:-translate-y-0.5"
      style={{
        background: 'rgba(255,255,255,0.65)',
        border: '1px solid rgba(255,255,255,0.90)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        boxShadow: '0 2px 12px rgba(26,96,128,0.07)',
      }}       
    >     



      {/* TAGS PLUS STATUS */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex gap-1.5 flex-wrap">
          {tags.map(tag => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ background: 'rgba(33,150,188,0.10)', color: '#1a6080' }}
            >
              {tag}
            </span>
          ))}
        </div>
        {status && (
          <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={statusStyle}>
            {status}
          </span>
        )}
      </div>

      

      <h3
        className="text-base font-semibold leading-snug"
        style={{ color: '#0f2a35' }}
      >
        {title}
      </h3>


      
      {excerptText && (
  <p
    className="text-sm leading-relaxed"
    style={{
      color: "#4a6a77",
      display: "-webkit-box",
      WebkitLineClamp: 2,
      WebkitBoxOrient: "vertical",
      overflow: "hidden",
    }}
  >
    {excerptText}
  </p>
)}

      

      <div
        className="flex items-center justify-between mt-auto pt-2"
        style={{ borderTop: '1px solid rgba(33,150,188,0.10)' }}
      >
        <div className="flex items-center gap-2 text-xs" style={{ color: '#7a9aa8' }}>
          {author && <span>{author}</span>}
          {date && <span>· {date}</span>}
          {readTime && <span>· {readTime}</span>}
        </div>
        {slug && (
          <Link
            to={`/blog/${slug}`}
            className="text-xs font-semibold hover:underline"
            style={{ color: '#2196bc' }}
          >
            Read →
          </Link>
        )}
      </div>
    </div>
  )
}
