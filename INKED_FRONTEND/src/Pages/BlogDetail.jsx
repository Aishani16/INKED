import { useParams, Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import api from '../services/api.js'
import Navbar from '../Components/Navbar.jsx'
import Footer from '../Components/Footer.jsx'
import { toast } from "react-toastify";



export default function BlogDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [post, setPost] = useState(null)
  const [currentUserId, setCurrentUserId] = useState(null)
  const [role, setRole] = useState("")
  const [isBookmarked, setIsBookmarked] =
  useState(false);
  const [isLiked, setIsLiked] =
  useState(false);
  const [likeCount, setLikeCount] =
  useState(0);
  const handleDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this blog?")
    if (!confirmed) return
    try {
    const token = localStorage.getItem("token")
    if (!post) return
    await api.delete(`/blogs/${post._id}`, {
      headers: {
        Authorization: `Bearer ${token}`
  }
})

navigate("/dashboard")
} catch (error) {
console.error("Delete failed:", error)
}
}

useEffect(() => {

  const fetchBlog = async () => {

    try {

      const token = localStorage.getItem("token")

const response = await api.get(
  `/blogs/${id}`,
  {
    headers: token
      ? {
          Authorization: `Bearer ${token}`
        }
      : {}
  }
)

      setPost(response.data)
      setLikeCount(
  response.data.likes?.length || 0
);
      if (token) {
  setIsLiked(
    response.data.likes?.includes(
      currentUserId
    )
  );
}
      if (token) {
  const bookmarksRes = await api.get(
    "/auth/bookmarks",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  setIsBookmarked(
    bookmarksRes.data.some(
      (blog) => blog._id === id
    )
  );
}
      console.log(response.data)

    } catch (error) {

      console.error(error)

    }
  }
  

  fetchBlog()

const token = localStorage.getItem("token")

if (token) {
  try {
    const payload = JSON.parse(
      atob(token.split(".")[1])
    )

    setCurrentUserId(payload.userId)
    setRole(localStorage.getItem("role") || "")

  } catch (error) {
    console.error(error)
  }
}

}, [id])
  if (!post) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      Loading...
    </div>
  )
}
 
  const isAuthor =
  currentUserId &&
  post?.author?._id === currentUserId
  const isAdmin = role === "admin"

  const handleBookmark = async () => {
  try {
    const token = localStorage.getItem("token");

    if (isBookmarked) {
      await api.delete(
        `/auth/bookmark/${post._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setIsBookmarked(false);
      toast.success("Bookmark removed");

    } else {
      await api.post(
        `/auth/bookmark/${post._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setIsBookmarked(true);
      toast.success("Blog saved");
    }

  } catch (error) {
    console.error(error);

    toast.error(
      error.response?.data?.message ||
      "Bookmark action failed"
    );
  }
};

const handleLike = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error(
        "Please login to like blogs"
      );
      return;
    }

    if (isLiked) {
      await api.delete(
        `/blogs/${post._id}/like`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setIsLiked(false);
      setLikeCount((prev) => prev - 1);

      toast.success("Like removed");
    } else {
      await api.post(
        `/blogs/${post._id}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setIsLiked(true);
      setLikeCount((prev) => prev + 1);

      toast.success("Blog liked");
    }
  } catch (error) {
    console.error(error);

    toast.error(
      error.response?.data?.message ||
      "Like action failed"
    );
  }
};

  return (
    <div className="page-bg min-h-screen">
      <Navbar />

      <article className="max-w-2xl mx-auto px-5 pt-28 pb-16">
        {/* Back */}
        <Link
          to="/dashboard"
          className="inline-block text-sm mb-8 hover:underline"
          style={{ color: '#4a6a77' }}
        >
          ← Back to Dashboard
        </Link>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-5">
          {(post.tags || []).map((tag) => (
            <span
              key={tag}
              className="text-xs px-2.5 py-1 rounded-full font-medium"
              style={{
                background: 'rgba(33,150,188,0.12)',
                color: '#1a6080',
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h1
          className="text-4xl sm:text-5xl mb-5 leading-tight"
          style={{
            fontFamily: "'DM Serif Display', serif",
            color: '#0f2a35',
          }}
        >
          {post.title}
        </h1>

        

        {/* Author Bar */}
        <div
          className="flex items-center justify-between py-4 mb-10"
          style={{
            borderTop: '1px solid rgba(33,150,188,0.12)',
            borderBottom: '1px solid rgba(33,150,188,0.12)',
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm"
              style={{
                background:
                  'linear-gradient(135deg, #2196bc, #1a6080)',
              }}
            >
              {post.author?.username?.charAt(0).toUpperCase() || 'U'}
            </div>

            <div>
              <p
                className="text-sm font-semibold"
                style={{ color: '#0f2a35' }}
              >
                {post.author?.username || 'Unknown Author'}
              </p>

              <p
                className="text-xs"
                style={{ color: '#7a9aa8' }}
              >
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
  onClick={handleBookmark}
  className="text-xs px-3 py-1.5 rounded-lg font-medium"
  style={{
  color: isBookmarked ? "#fff" : "#4a6a77",
  background: isBookmarked ? "#2196bc" : "transparent",
  border: "1px solid rgba(33,150,188,0.18)",
}}
>
 {isBookmarked ? "✅ Saved" : "🔖 Save"}
</button>
             
            


{isAuthor && (
  <button
    className="text-xs px-3 py-1.5 rounded-lg font-medium"
    style={{
      color: '#4a6a77',
      border: '1px solid rgba(33,150,188,0.18)',
    }}
  >
    <Link to={`/editor/${post._id}`}>
      ✏️ Edit
    </Link>
  </button>
)}

{(isAuthor || isAdmin) && (
  <button
    onClick={handleDelete}
    className="text-xs px-3 py-1.5 rounded-lg font-medium"
    style={{
      color: '#4a6a77',
      border: '1px solid rgba(33,150,188,0.18)',
    }}
  >
    🗑 Delete
  </button>
)}

          </div>
        </div>

        {/* Blog Content */}
        <div>
          <p
            className="text-base leading-8 whitespace-pre-line"
            style={{ color: '#2a4a5a' }}
          >
            {post.content}
          </p>
        </div>
        <div
  className="flex items-center gap-6 mt-10 pt-6"
  style={{
    borderTop:
      "1px solid rgba(33,150,188,0.12)",
  }}
>
  <button
    onClick={handleLike}
    className="text-sm font-medium"
    style={{ color: "#4a6a77" }}
  >
    {isLiked ? "❤️" : "🤍"} {likeCount}
  </button>

  <button
    className="text-sm font-medium"
    style={{ color: "#4a6a77" }}
  >
    💬 Comments
  </button>

  <button
    className="text-sm font-medium"
    style={{ color: "#4a6a77" }}
  >
    ↗ Share
  </button>
</div>

        {/* Author Footer */}
        <div
          className="flex items-center gap-4 mt-14 pt-8"
          style={{
            borderTop: '1px solid rgba(33,150,188,0.12)',
          }}
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
            style={{
              background:
                'linear-gradient(135deg, #2196bc, #1a6080)',
            }}
          >
            {post.author?.username?.charAt(0).toUpperCase() || 'U'}
          </div>

          <div>
            <p
              className="text-sm font-semibold"
              style={{ color: '#0f2a35' }}
            >
              Written by {post.author?.username || 'Unknown Author'}
            </p>

            <p
              className="text-xs"
              style={{ color: '#7a9aa8' }}
            >
              Published on Inked
            </p>
          </div>

          <Link
            to="/signup"
            className="ml-auto px-4 py-2 rounded-xl text-white text-xs font-semibold hover:opacity-90"
            style={{
              background:
                'linear-gradient(135deg, #2196bc, #1a6080)',
            }}
          >
            Start Writing
          </Link>
        </div>
      </article>

      <Footer />
    </div>
  )
}  