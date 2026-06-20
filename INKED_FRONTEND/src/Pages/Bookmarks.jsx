import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import BlogCard from "../Components/BlogCard";

export default function Bookmarks() {

  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetchBookmarks();
  }, []);

  async function fetchBookmarks() {
    try {

      const token =
        localStorage.getItem("token");

      const response = await api.get(
        "/auth/bookmarks",
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      setBlogs(response.data);

    } catch (error) {

      console.error(error);

    }
  }

  return (
  <div className="page-bg min-h-screen">
    <Navbar />

    <section className="pt-20 pb-20 px-5">
      <div className="max-w-6xl mx-auto">

        {/* Header */}

        <div className="text-center mb-12">
          <span
            className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4"
            style={{
              background: "rgba(33,150,188,0.12)",
              color: "#1a6080",
            }}
          >
            Your Library
          </span>

          <h1
            className="text-4xl md:text-5xl mb-3"
            style={{
              fontFamily: "'DM Serif Display', serif",
              color: "#0f2a35",
            }}
          >
            Saved Blogs
          </h1>

          <p
            className="max-w-2xl mx-auto"
            style={{ color: "#4a6a77" }}
          >
            Articles you've bookmarked to read later.
          </p>
        </div>

        {/* Stats Card */}

        <div
          className="rounded-3xl p-8 mb-12 text-center"
          style={{
            background: "rgba(255,255,255,0.65)",
            border: "1px solid rgba(255,255,255,0.90)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            boxShadow:
              "0 2px 12px rgba(26,96,128,0.07)",
          }}
        >
          <p
            className="text-xs font-semibold tracking-widest uppercase mb-3"
            style={{ color: "#7a9aa8" }}
          >
            Saved Articles
          </p>

          <h2
            className="text-4xl mb-2"
            style={{
              fontFamily:
                "'DM Serif Display', serif",
              color: "#0f2a35",
            }}
          >
            {blogs.length}
          </h2>

          <p style={{ color: "#4a6a77" }}>
            Blogs saved in your collection.
          </p>
        </div>

        {/* Content */}

        {blogs.length === 0 ? (
          <div
            className="rounded-3xl p-12 text-center"
            style={{
              background: "rgba(255,255,255,0.65)",
              border: "1px solid rgba(255,255,255,0.90)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              boxShadow:
                "0 2px 12px rgba(26,96,128,0.07)",
            }}
          >
            <h3
              className="text-2xl font-semibold mb-3"
              style={{ color: "#0f2a35" }}
            >
              No Saved Blogs Yet
            </h3>

            <p style={{ color: "#4a6a77" }}>
              Bookmark articles and they'll appear here.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h2
                className="text-3xl mb-2"
                style={{
                  fontFamily:
                    "'DM Serif Display', serif",
                  color: "#0f2a35",
                }}
              >
                Your Reading List
              </h2>

              <p style={{ color: "#4a6a77" }}>
                Quickly revisit your saved articles.
              </p>
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {blogs.map((blog) => (
                <BlogCard
                  key={blog._id}
                  title={blog.title}
                  excerpt={blog.content}
                  tags={blog.tags}
                  slug={blog._id}
                  status="Saved"
                />
              ))}
            </div>
          </>
        )}

      </div>
    </section>

    <Footer />
  </div>
)
}