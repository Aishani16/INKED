import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import api from "../services/api";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import BlogCard from "../Components/BlogCard";

export default function Profile() {
const { username } = useParams();

const [user, setUser] = useState(null);
const [blogs, setBlogs] = useState([]);
const [editing, setEditing] = useState(false);
const [bio, setBio] = useState("");

useEffect(() => {
const fetchProfile = async () => {
try {
const res = await api.get(
`/users/${username}`
);


    setUser(res.data.user);
setBlogs(res.data.blogs);

setBio(res.data.user.bio || "");

  } catch (error) {
    console.error(error);
  }
};

fetchProfile();


}, [username]);

if (!user) {
  
return ( <div className="page-bg min-h-screen flex items-center justify-center">
Loading... </div>
);
}
const loggedInUsername =
  localStorage.getItem("username");

const isOwner =
  loggedInUsername === user.username;

const handleSave = async () => {
  try {

    const token =
      localStorage.getItem("token");

    const response =
      await api.put(
        "/users/me",
        {
          username: user.username,
          bio,
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    setUser(response.data);

    setEditing(false);

  } catch (error) {

    console.error(error);

  }
};

return ( <div className="page-bg min-h-screen"> <Navbar />

  <section className="pt-28 pb-16 px-5">
    <div className="max-w-4xl mx-auto">

      {/* Profile Header */}

      <div
        className="rounded-3xl p-8 mb-10"
        style={{
          background: "rgba(255,255,255,0.65)",
          border: "1px solid rgba(255,255,255,0.90)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          boxShadow:
            "0 2px 12px rgba(26,96,128,0.07)",
        }}
      >
        <div className="flex items-center gap-5">

          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold"
            style={{
              background:
                "linear-gradient(135deg,#2196bc,#1a6080)",
            }}
          >
            {user.username
              ?.charAt(0)
              .toUpperCase()}
          </div>

          <div>
            <h1
              className="text-4xl"
              style={{
                fontFamily:
                  "'DM Serif Display', serif",
                color: "#0f2a35",
              }}
            >
              {user.username}
            </h1>

            {editing ? (
  <>
    <textarea
      value={bio}
      onChange={(e) =>
        setBio(e.target.value)
      }
      rows={4}
      className="mt-2 w-full p-3 rounded-xl border"
    />

    <button
      onClick={handleSave}
      className="mt-4 px-4 py-2 rounded-xl text-white text-sm"
      style={{
        background:
          "linear-gradient(135deg,#2196bc,#1a6080)",
      }}
    >
      Save Changes
    </button>
  </>
) : (
  <p
    className="mt-2"
    style={{
      color: "#4a6a77",
    }}
  >
    {bio || "Writer on Inked"}
  </p>
)}

            <p
              className="text-sm mt-2"
              style={{
                color: "#7a9aa8",
              }}
            >
              Joined{" "}
              {new Date(
                user.createdAt
              ).toLocaleDateString()}
            </p>
            {isOwner && !editing && (
  <button
    onClick={() => setEditing(true)}
    className="mt-4 px-4 py-2 rounded-xl text-white text-sm"
    style={{
      background:
        "linear-gradient(135deg,#2196bc,#1a6080)",
    }}
  >
     Edit Profile
  </button>
)}
          </div>
        </div>
      </div>

      {/* Stats */}

      <div className="grid sm:grid-cols-3 gap-4 mb-10">

        <div
          className="rounded-2xl p-5"
          style={{
            background:
              "rgba(255,255,255,0.65)",
            border:
              "1px solid rgba(255,255,255,0.90)",
            boxShadow:
              "0 2px 12px rgba(26,96,128,0.07)",
          }}
        >
          <p
            className="text-xs"
            style={{
              color: "#7a9aa8",
            }}
          >
            Published Articles
          </p>

          <h3
            className="text-2xl font-bold"
            style={{
              color: "#0f2a35",
            }}
          >
            {blogs.length}
          </h3>
        </div>

      </div>

      {/* Articles */}

      <div className="mb-6">
        <h2
          className="text-3xl"
          style={{
            fontFamily:
              "'DM Serif Display', serif",
            color: "#0f2a35",
          }}
        >
          Published Articles
        </h2>
      </div>

      {blogs.length === 0 ? (
  <div
    className="rounded-2xl p-6"
    style={{
      background:
        "rgba(255,255,255,0.65)",
      border:
        "1px solid rgba(255,255,255,0.90)",
    }}
  >
    <p
      style={{
        color: "#4a6a77",
      }}
    >
      No published articles yet.
    </p>
  </div>
) : (
  <div className="space-y-4">
    {blogs.map((blog) => (
      <BlogCard
        key={blog._id}
        title={blog.title}
        excerpt={
          blog.content?.slice(0, 120) +
          "..."
        }
        date={new Date(
          blog.createdAt
        ).toLocaleDateString()}
        tags={blog.tags || []}
        slug={blog.slug}
        status="Published"
      />
    ))}
  </div>
)}
    </div>
  </section>

  <Footer />
</div>


);
}
