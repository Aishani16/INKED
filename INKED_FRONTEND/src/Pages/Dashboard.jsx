import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

import Navbar from '../Components/Navbar.jsx'
import BlogCard from '../Components/BlogCard.jsx'
import DashboardCard from '../Components/DashboardCard.jsx'

import api from '../services/api.js'

export default function Dashboard() {
  const [blogs, setBlogs] = useState([])
  const username =
  localStorage.getItem("username")

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const token = localStorage.getItem("token")
        const response = await api.get(
  "/blogs/myblogs",
  {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
)

        console.log(response.data)

        setBlogs(response.data)
      } catch (error) {
        console.error(error)
      }
    }

    fetchBlogs()
  }, [])

  const drafts = blogs.filter(
  blog => blog.status === "draft"
)

const pending = blogs.filter(
  blog => blog.status === "pending"
)

const published = blogs.filter(
  blog => blog.status === "published"
)

const rejected = blogs.filter(
  blog => blog.status === "rejected"
)
  const stats = [
  {
    emoji: '📝',
    label: 'Total Articles',
    value: blogs.length,
    change: null,
  },
  {
    emoji: '✅',
    label: 'Published',
    value: published.length,
    change: null,
  },
  {
    emoji: '✏️',
    label: 'Drafts',
    value: drafts.length,
    change: null,
  },
  {
    emoji: "⏳",
    label: "Pending",
    value: pending.length,
  },
  {
    emoji: "❌",
    label: "Rejected",
    value: rejected.length,
  },
  
]

  return (
    <div className="page-bg min-h-screen">
      <Navbar />

      <main className="max-w-6xl mx-auto px-5 pt-24 pb-16">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <div>
            <h1
              className="text-3xl mb-1"
              style={{
                fontFamily: "'DM Serif Display', serif",
                color: '#0f2a35',
              }}
            >
              Welcome Back, {username}!
            </h1>

            <p
              className="text-sm"
              style={{ color: '#4a6a77' }}
            >
              Here's an overview of your content.
            </p>
          </div>

          <Link
            to="/editor"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold text-sm hover:opacity-90 self-start sm:self-auto"
            style={{
              background:
                'linear-gradient(135deg, #2196bc, #1a6080)',
            }}
          >
            + New Article
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
          {stats.map(s => (
            <DashboardCard
              key={s.label}
              {...s}
            />
          ))}
        </div>

        <section className="mb-12">
          <div className="flex items-center justify-between mb-5">
            <h2
              className="text-lg font-semibold"
              style={{ color: '#0f2a35' }}
            >
              Drafts{' '}
              <span
                className="text-xs font-bold ml-1 px-2 py-0.5 rounded-full"
                style={{
                  background:
                    'rgba(254,188,46,0.18)',
                  color: '#9a6800',
                }}
              >
                {drafts.length}
              </span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {drafts.map(post => (
              <BlogCard
                key={post.slug}
                title={post.title}
                excerpt={post.content}
                tags={post.tags}
                status="Draft"
                slug={post.slug}
              />
            ))}
          </div>
        </section>


        <section className="mb-12">
          <div className="flex items-center justify-between mb-5">
            <h2
              className="text-lg font-semibold"
              style={{ color: '#0f2a35' }}
            >
              Pending Reviews{' '}
              <span
                className="text-xs font-bold ml-1 px-2 py-0.5 rounded-full"
                style={{
                  background: 'rgba(33,150,188,0.15)',
color: '#1a6080',
                }}
              >
                {pending.length}
              </span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pending.map(post => (
              <BlogCard
                key={post.slug}
                title={post.title}
                excerpt={post.content}
                tags={post.tags}
                status="Pending"
                slug={post.slug}
              />
            ))}
          </div>
        </section>

        <section className="mb-12">
          <div className="flex items-center justify-between mb-5">
            <h2
              className="text-lg font-semibold"
              style={{ color: '#0f2a35' }}
            >
              Published{' '}
              <span
                className="text-xs font-bold ml-1 px-2 py-0.5 rounded-full"
                style={{
                  background:
                    'rgba(40,200,64,0.12)',
                  color: '#1a7a30',
                }}
              >
                {published.length}
              </span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {published.map(post => (
              <BlogCard
                key={post.slug}
                title={post.title}
                excerpt={post.content}
                tags={post.tags}
                status="Published"
                slug={post.slug}
              />
            ))}
          </div>
        </section>
  
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2
              className="text-lg font-semibold"
              style={{ color: '#0f2a35' }}
            >
              Rejected{' '}
              <span
                className="text-xs font-bold ml-1 px-2 py-0.5 rounded-full"
                style={{
                  background: 'rgba(255,0,0,0.12)',
color: '#b00020',
                }}
              >
                {rejected.length}
              </span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {rejected.map(post => (
              <BlogCard
                key={post.slug}
                title={post.title}
                excerpt={post.content}
                tags={post.tags}
                status="Rejected"
                slug={post.slug}
              />
            ))}
          </div>
        </section>

      </main>
    </div>
  )
}
