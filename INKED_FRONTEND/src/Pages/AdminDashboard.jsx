import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { toast } from "react-toastify";

export default function AdminDashboard() {
  const [blogs, setBlogs] = useState([]);

  async function fetchPendingBlogs() {
    try {
      const response = await api.get(
        "/admin/pending",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "token"
            )}`,
          },
        }
      );

      setBlogs(response.data);

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Failed to load blogs"
      );

    }
  }

  useEffect(() => {
    fetchPendingBlogs();
  }, []);

  async function approveBlog(id) {
    try {

      await api.put(
        `/admin/approve/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "token"
            )}`,
          },
        }
      );

      toast.success("Blog approved");

      fetchPendingBlogs();

    } catch {

      toast.error("Approval failed");

    }
  }

  async function rejectBlog(id) {

    const reason = prompt(
      "Enter rejection reason"
    );

    if (reason === null) return;

    try {

      await api.put(
        `/admin/reject/${id}`,
        { reason },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "token"
            )}`,
          },
        }
      );

      toast.success("Blog rejected");

      fetchPendingBlogs();

    } catch {

      toast.error("Rejection failed");

    }
  }

  async function deleteBlog(id) {

    const confirmed = window.confirm(
      "Delete this blog?"
    );

    if (!confirmed) return;

    try {

      await api.delete(
        `/admin/blog/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "token"
            )}`,
          },
        }
      );

      toast.success("Blog deleted");

      fetchPendingBlogs();

    } catch {

      toast.error("Delete failed");

    }
  }

  return (
    <div className="page-bg min-h-screen">
      <Navbar />

      <section className="pt-28 pb-20 px-5">
        <div className="max-w-6xl mx-auto">

          {/* Header */}

          <div className="text-center mb-12">
            <span
              className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4"
              style={{
                background:
                  "rgba(33,150,188,0.12)",
                color: "#1a6080",
              }}
            >
              Content Moderation
            </span>

            <h1
              className="text-4xl mb-4"
              style={{
                fontFamily:
                  "'DM Serif Display', serif",
                color: "#0f2a35",
              }}
            >
              Admin Dashboard
            </h1>

            <p
              className="max-w-xl mx-auto"
              style={{
                color: "#4a6a77",
              }}
            >
              Review pending submissions,
              approve quality content,
              reject unsuitable articles,
              and manage the platform.
            </p>
          </div>

          {/* Stats */}

          <div className="grid md:grid-cols-3 gap-4 mb-10">

            <div
              className="rounded-2xl p-6"
              style={{
                background:
                  "rgba(255,255,255,0.65)",
                border:
                  "1px solid rgba(255,255,255,0.90)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter:
                  "blur(10px)",
              }}
            >
              <p
                className="text-sm mb-2"
                style={{ color: "#4a6a77" }}
              >
                Pending Reviews
              </p>

              <h2
                className="text-3xl font-bold"
                style={{ color: "#0f2a35" }}
              >
                {blogs.length}
              </h2>
            </div>

          </div>

          {/* Blogs */}

          {blogs.length === 0 ? (
            <div
              className="rounded-2xl p-10 text-center"
              style={{
                background:
                  "rgba(255,255,255,0.65)",
                border:
                  "1px solid rgba(255,255,255,0.90)",
                backdropFilter: "blur(10px)",
              }}
            >
              <h2
                className="text-xl font-semibold mb-2"
                style={{ color: "#0f2a35" }}
              >
                No Pending Blogs
              </h2>

              <p
                style={{
                  color: "#4a6a77",
                }}
              >
                Everything has been reviewed.
              </p>
            </div>
          ) : (
            <div className="space-y-5">

              {blogs.map((blog) => (

                <div
                  key={blog._id}
                  className="rounded-2xl p-6"
                  style={{
                    background:
                      "rgba(255,255,255,0.65)",
                    border:
                      "1px solid rgba(255,255,255,0.90)",
                    backdropFilter:
                      "blur(10px)",
                    WebkitBackdropFilter:
                      "blur(10px)",
                    boxShadow:
                      "0 2px 12px rgba(26,96,128,0.07)",
                  }}
                >
                  <div className="flex flex-col md:flex-row md:justify-between gap-4">

                    <div>

                      <h2
                        className="text-xl font-semibold mb-2"
                        style={{
                          color: "#0f2a35",
                        }}
                      >
                        {blog.title}
                      </h2>

                      <p
                        className="text-sm"
                        style={{
                          color: "#4a6a77",
                        }}
                      >
                        Author:{" "}
                        {blog.author?.username}
                      </p>

                      <p
                        className="text-sm mt-1"
                        style={{
                          color: "#7a9aa8",
                        }}
                      >
                        {blog.author?.email}
                      </p>

                    </div>

                    <div className="flex gap-3 flex-wrap">

                      <button
                        onClick={() =>
                          approveBlog(blog._id)
                        }
                        className="px-4 py-2 rounded-lg text-white font-medium"
                        style={{
                          background:
                            "linear-gradient(135deg,#22c55e,#16a34a)",
                        }}
                      >
                        Approve
                      </button>

                      <button
                        onClick={() =>
                          rejectBlog(blog._id)
                        }
                        className="px-4 py-2 rounded-lg text-white font-medium"
                        style={{
                          background:
                            "linear-gradient(135deg,#f59e0b,#d97706)",
                        }}
                      >
                        Reject
                      </button>

                      <button
                        onClick={() =>
                          deleteBlog(blog._id)
                        }
                        className="px-4 py-2 rounded-lg text-white font-medium"
                        style={{
                          background:
                            "linear-gradient(135deg,#ef4444,#dc2626)",
                        }}
                      >
                        Delete
                      </button>

                    </div>

                  </div>
                </div>

              ))}

            </div>
          )}

        </div>
      </section>

      <Footer />
    </div>
  );
}