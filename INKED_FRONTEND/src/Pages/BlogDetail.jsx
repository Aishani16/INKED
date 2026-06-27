import { useParams, Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import api from '../services/api.js'
import Navbar from '../Components/Navbar.jsx'
import Footer from '../Components/Footer.jsx'
import { toast } from "react-toastify";



export default function BlogDetail() {
  const { slug } = useParams()
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
  const [comments, setComments] =
  useState([]);
  const [commentText, setCommentText] =
  useState("");


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
  const token = localStorage.getItem("token");

  let userId = null;

  if (token) {
    try {
      const payload = JSON.parse(
        atob(token.split(".")[1])
      );

      userId = payload.userId;

      setCurrentUserId(userId);
      setRole(localStorage.getItem("role") || "");
    } catch (error) {
      console.error(error);
    }
  }

  const fetchBlog = async () => {
    try {
      const response = await api.get(
        `/blogs/${slug}`,
        {
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {},
        }
      );

      setPost(response.data);

      const commentsRes =
  await api.get(
    `/comments/${response.data._id}`
  );

setComments(commentsRes.data);

      setLikeCount(
        response.data.likes?.length || 0
      );

      if (userId) {
  setIsLiked(
    response.data.likes?.some(
      like => String(like) === userId
    )
  );
}

      if (token) {
        const bookmarksRes =
          await api.get("/auth/bookmarks", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

        setIsBookmarked(
          bookmarksRes.data.some(
            (blog) => blog.slug === slug
          )
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  fetchBlog();
}, [slug]);
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

      
    }
  } catch (error) {
    console.error(error);

    toast.error(
      error.response?.data?.message ||
      "Like action failed"
    );
  }
};

const handleComment = async () => {
  try {
    const token =
      localStorage.getItem("token");

    if (!token) {
      toast.error(
        "Please login to comment"
      );
      return;
    }

    if (!commentText.trim()) {
      toast.error(
        "Comment cannot be empty"
      );
      return;
    }

    const response =
      await api.post(
        `/comments/${post._id}`,
        {
          text: commentText,
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    setComments((prev) => [
      response.data,
      ...prev,
    ]);

    setCommentText("");

    

  } catch (error) {
    console.error(error);

    toast.error(
      error.response?.data?.message ||
      "Failed to comment"
    );
  }
};


const handleDeleteComment =
  async (commentId) => {
    try {

      const token =
        localStorage.getItem("token");

      const confirmed = window.confirm(
  "Are you sure you want to delete this comment?"
);

if (!confirmed) return;

await api.delete(
  `/comments/${commentId}`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

setComments(
  comments.filter(
    (comment) =>
      comment._id !== commentId
  )
);

    } catch (error) {

      console.error(error);

      toast.error(
        "Failed to delete comment"
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
            <Link
  to={`/profile/${post.author?.username}`}
>
  <div
    className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm cursor-pointer"
    style={{
      background:
        "linear-gradient(135deg,#2196bc,#1a6080)",
    }}
  >
    {post.author?.username
      ?.charAt(0)
      .toUpperCase()}
  </div>
</Link>

            <div>
              <p
                className="text-sm font-semibold"
                style={{ color: '#0f2a35' }}
              >
                Written By {post.author?.username || 'Unknown Author'}
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
<div className="space-y-6">
  {post.content?.blocks?.map((block) => {
    switch (block.type) {
     
        case "header": {
  const level = block.data.level;

  const HeadingTag = `h${level}`;

  const classes = {
    1: "text-5xl",
    2: "text-4xl",
    3: "text-3xl",
    4: "text-2xl",
    5: "text-xl",
    6: "text-lg",
  };

  return (
    <HeadingTag
  key={block.id}
  className={`${classes[level]} font-bold`}
  style={{ color: "#0f2a35" }}
  dangerouslySetInnerHTML={{
    __html: block.data.text,
  }}
/>
  );
}

      case "paragraph":
        return (
          <p
            key={block.id}
            className="text-base leading-8"
            style={{ color: "#2a4a5a" }}
            dangerouslySetInnerHTML={{
              __html: block.data.text,
            }}
          />
        );

      case "list":
        return (
          <ul
            key={block.id}
            className="list-disc pl-6 space-y-2"
          >
            {block.data.items.map((item, index) => (
              <li
                key={index}
                dangerouslySetInnerHTML={{
                  __html: item,
                }}
              />
            ))}
          </ul>
        );

        case "checklist":
  return (
    <div key={block.id} className="space-y-2">
      {block.data.items.map((item, index) => (
        <label
          key={index}
          className="flex items-center gap-2"
        >
          <input
            type="checkbox"
            checked={item.checked}
            readOnly
          />
          <span>{item.text}</span>
        </label>
      ))}
    </div>
  );

      case "quote":
  return (
    <blockquote
      key={block.id}
      className="border-l-4 border-cyan-500 pl-5 my-6"
    >
      <p
        className="italic text-lg"
        dangerouslySetInnerHTML={{
          __html: block.data.text,
        }}
      />

      {block.data.caption && (
        <footer className="mt-3 text-sm text-gray-500">
          — {block.data.caption}
        </footer>
      )}
    </blockquote>
  );
      case "code":
        return (
          <pre className="bg-red-900 text-gray-100 p-4 font-semibold rounded-lg overflow-auto">
    <code>{block.data.code}</code>
</pre>
        );

        case "table":
  return (
    <table
      key={block.id}
      className="w-full border border-gray-300"
    >
      <tbody>
        {block.data.content.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <td
                key={cellIndex}
                className="border p-2"
                dangerouslySetInnerHTML={{
                  __html: cell,
                }}
              />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );

      case "delimiter":
        return <hr key={block.id} className="my-8" />;

      case "embed":
  return (
    <div key={block.id} className="my-8">
      <iframe
        src={block.data.embed}
        className="w-full aspect-video rounded-xl"
        allowFullScreen
        title={block.data.caption || "Embedded content"}
      />

      {block.data.caption && (
        <p className="mt-2 text-sm text-center text-gray-500">
          {block.data.caption}
        </p>
      )}
    </div>
  );

      default:
        return null;
    }
  })}
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

<div
  className="mt-12 pt-8"
  style={{
    borderTop:
      "1px solid rgba(33,150,188,0.12)",
  }}
>
  <h3
    className="text-xl font-semibold mb-6"
    style={{ color: "#0f2a35" }}
  >
    Comments ({comments.length})
  </h3>

  <div className="mb-8">
  <textarea
    value={commentText}
    onChange={(e) =>
      setCommentText(e.target.value)
    }
    placeholder="Write a comment..."
    rows={4}
    className="w-full p-3 rounded-xl border outline-none"
  />

  <button
    onClick={handleComment}
    className="mt-3 px-4 py-2 rounded-lg text-white text-sm"
    style={{
      background:
        "linear-gradient(135deg,#2196bc,#1a6080)",
    }}
  >
    Post Comment
  </button>
</div>

  {comments.length === 0 ? (
    <p
      style={{
        color: "#7a9aa8",
      }}
    >
      No comments yet.
    </p>
  ) : (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div
          key={comment._id}
          className="p-4 rounded-xl"
          style={{
            background:
              "rgba(33,150,188,0.04)",
          }}
        >
          <div className="flex justify-between items-start">
  <div className="flex items-start gap-3">

    <Link to={`/profile/${comment.user?.username}`}>
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold"
        style={{
          background:
            "linear-gradient(135deg,#2196bc,#1a6080)",
        }}
      >
        {comment.user?.username
          ?.charAt(0)
          .toUpperCase()}
      </div>
    </Link>

    <div>
      <div className="flex items-center gap-2">
        <Link
          to={`/profile/${comment.user?.username}`}
          className="font-medium hover:underline"
          style={{ color: "#0f2a35" }}
        >
          {comment.user?.username}
        </Link>

        <span
          className="text-xs"
          style={{ color: "#7a9aa8" }}
        >
           {new Date(comment.createdAt).toLocaleDateString()}
        </span>
      </div>

      <p
        className="mt-1"
        style={{ color: "#4a6a77" }}
      >
        {comment.text}
      </p>
    </div>

  </div>

  {(currentUserId === comment.user?._id ||
    role === "admin") && (
    <button
      className="text-xs hover:underline"
      onClick={() =>
        handleDeleteComment(comment._id)
      }
    >
      Delete
    </button>
  )}
</div>

        </div>
      ))}
    </div>
  )}
</div>

       
        
      </article>

      <Footer />
    </div>
  )
}  