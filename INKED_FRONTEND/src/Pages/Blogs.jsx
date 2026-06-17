import { useEffect, useState } from "react";
import api from "../services/api";
import BlogCard from "../Components/BlogCard";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { FiSearch } from "react-icons/fi";



export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const filteredBlogs = blogs.filter((blog) => {
  const search = searchTerm.toLowerCase();

  const titleMatch =
    blog.title?.toLowerCase().includes(search);

  const contentMatch =
    blog.content?.toLowerCase().includes(search);

  const tagMatch =
    blog.tags?.some((tag) =>
      tag.toLowerCase().includes(search)
    );

  return titleMatch || contentMatch || tagMatch;
});

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await api.get("/blogs/published");
      setBlogs(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="page-bg min-h-screen">
      <Navbar />

      <section className="pt-20 pb-20 px-5">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
            <div>
              <span
                className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4"
                style={{
                  background: "rgba(33,150,188,0.12)",
                  color: "#1a6080",
                }}
              >
                Explore Articles
              </span>

              <h1
                className="text-4xl md:text-5xl mb-3"
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  color: "#0f2a35",
                }}
              >
                Published Blogs
              </h1>

              <p
                className="max-w-2xl text-base leading-relaxed"
                style={{ color: "#4a6a77" }}
              >
                Discover tutorials, stories, insights, and ideas shared by
                writers across the Inked community.
              </p>
            </div>

            {/* Search */}
            <div className="relative w-full md:w-72">
            <FiSearch
                size={18} style={{position: "absolute",  left: "12px", top: "50%",transform: "translateY(-50%)",
                  color: "#4a6a77",zIndex: 10,pointerEvents: "none", }}/>

            <input type="text" placeholder="Search by title, content, or tag..."
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl outline-none"
                style={{ background: "rgba(255,255,255,0.65)",backdropFilter: "blur(10px)",}}/>
          </div>
        </div>
 
          {/* Comm. Art. Card */}
          <div
            className="rounded-3xl p-8 mb-12 text-center"
            style={{
              background: "rgba(255,255,255,0.65)",
              border: "1px solid rgba(255,255,255,0.90)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              boxShadow: "0 2px 12px rgba(26,96,128,0.07)",
            }}
          >
            <p
              className="text-xs font-semibold tracking-widest uppercase mb-3"
              style={{ color: "#7a9aa8" }}
            >
              Community Articles
            </p>

            <h2
              className="text-4xl mb-2"
              style={{
                fontFamily: "'DM Serif Display', serif",
                color: "#0f2a35",
              }}
            >
              {filteredBlogs.length}
            </h2>

            <p style={{ color: "#4a6a77" }}>
              Published articles available to read and explore.
            </p>
          </div>

          {blogs.length === 0 ? (
            <div
              className="rounded-3xl p-12 text-center"
              style={{
                background: "rgba(255,255,255,0.65)",
                border: "1px solid rgba(255,255,255,0.90)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                boxShadow: "0 2px 12px rgba(26,96,128,0.07)",
              }}
            >
              <h3
                className="text-2xl font-semibold mb-3"
                style={{ color: "#0f2a35" }}
              >
                No Blogs Yet
              </h3>

              <p style={{ color: "#4a6a77" }}>
                Published articles will appear here once writers start sharing
                their content.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h2
                  className="text-3xl mb-2"
                  style={{
                    fontFamily: "'DM Serif Display', serif",
                    color: "#0f2a35",
                  }}
                >
                  Latest Publications
                </h2>

                <p style={{ color: "#4a6a77" }}>
                  Freshly published articles from writers on Inked.
                </p>
              </div>

              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredBlogs.map((blog) => (
                  <BlogCard
                    key={blog._id}
                    title={blog.title}
                    excerpt={blog.content}
                    tags={blog.tags}
                    slug={blog._id}
                    status="Published"
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}