
import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import api from '../services/api'
import { toast } from "react-toastify";

export default function Editor() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState('')
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
  if (id) return

  const savedDraft =
    localStorage.getItem("editorDraft")

  if (savedDraft) {
    try {
      const parsed = JSON.parse(savedDraft)

      setTitle(parsed.title || "")
      setContent(parsed.content || "")
      setTags(parsed.tags || "")
    } catch (error) {
      console.error(error)
    }
  }

  setIsLoaded(true)

}, [id])

useEffect(() => {
  if (id) return
  if (!isLoaded) return

  localStorage.setItem(
    "editorDraft",
    JSON.stringify({
      title,
      content,
      tags
    })
  )
}, [title, content, tags, id, isLoaded])
  
  useEffect(() => {

  if (!id) return

  const fetchBlog = async () => {
  try {

    const token = localStorage.getItem("token")

    const response = await api.get(
      `/blogs/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    setTitle(response.data.title)

    setTags(
      (response.data.tags || []).join(", ")
    )

    setContent(response.data.content)

  } catch (error) {
    console.error(error)
  }
}

  fetchBlog()

}, [id])

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0

  async function handleSaveDraft() {
  const token = localStorage.getItem("token")

  if (!token) {
    toast.error("Please login first")
    return
  }

  if (!title.trim()) {
    toast.warning("Please enter a title")
    return
  }

  if (!content.trim()) {
    toast.warning("Please write some content")
    return
  }

  try {
    let response

if (id) {

  response = await api.put(
    `/blogs/${id}`,
    {
      title,
      content,
      tags: tags.split(",").map(tag => tag.trim()),
      
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )

} else {

  response = await api.post(
    "/blogs/create",
    {
      title,
      content,
      tags: tags.split(",").map(tag => tag.trim()),
      
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )

}
    console.log(response.data)

    toast.success("Draft saved successfully!")

localStorage.removeItem("editorDraft")

if (!id) {
  navigate(`/editor/${response.data._id}`)
}

  } catch (error) {
    console.error(error)

    toast.error(
      error.response?.data?.message ||
      "Failed to save draft"
)
  }
}

async function handleSubmitForReview() {

  const token = localStorage.getItem("token")

  if (!token) {
    toast.error("Please login first")
    return
  }

  if (!title.trim()) {
    toast.warning("Please enter a title")
    return
  }

  if (!content.trim()) {
    toast.warning("Please write some content")
    return
  }

  try {

    let blogId

    if (id) {

      const updateResponse = await api.put(
        `/blogs/${id}`,
        {
          title,
          content,
          tags: tags
            .split(",")
            .map(tag => tag.trim())
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      blogId = updateResponse.data._id

    } else {

      const createResponse = await api.post(
        "/blogs/create",
        {
          title,
          content,
          tags: tags
            .split(",")
            .map(tag => tag.trim())
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      blogId = createResponse.data._id
    }

    await api.put(
      `/blogs/submit/${blogId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    toast.success(
      "Article submitted for review"
    )

    setTimeout(() => {
      navigate("/dashboard")
    }, 1000)

  } catch (error) {

    toast.error(
      error.response?.data?.message ||
      "Submission failed"
    )

  }
}

  function handleAiAssist() {
    if (!content.trim()) {
      toast.warning("Write something first.")
      return
    }

    setContent(
      content +
        '\n\n[AI Suggestion]: Add an example to make this section more engaging.'
    )
  }

  return (
    <div
      className="min-h-screen px-5 py-10"
      style={{
        background:
          'linear-gradient(155deg, #eef8fb 0%, #d7f1f6 45%, #c2eaf3 100%)',
      }}
    >
      <div className="max-w-4xl mx-auto">
       
        <Link
          to="/dashboard"
          className="text-sm hover:underline"
          style={{ color: '#1a6080' }}
        >
           Back to Dashboard
        </Link>

     
        <div
          className="mt-6 rounded-2xl p-8"
          style={{
            background: 'rgba(255,255,255,0.68)',
            border: '1px solid rgba(255,255,255,0.92)',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            boxShadow: '0 8px 40px rgba(26,96,128,0.12)',
          }}
        >
          <h1
            className="text-3xl mb-6"
            style={{
              fontFamily: "'DM Serif Display', serif",
              color: '#0f2a35',
            }}
          >
            {id ? "Edit Article" : "Write Article"}
          </h1>

        
          <div className="mb-5">
            <label
              className="block text-sm font-semibold mb-2"
              style={{ color: '#4a6a77' }}
            >
              Article Title
            </label>

            <input
              type="text"
              placeholder="Enter article title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl outline-none"
              style={{
                background: 'rgba(255,255,255,0.75)',
                border: '1px solid rgba(33,150,188,0.20)',
              }}
            />
          </div>
          <div className="mb-5">
            <label className="block text-sm font-semibold mb-2" style={{ color: '#4a6a77' }}>
              Tags
            </label>

            <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="React, JavaScript, Frontend"
                className="w-full px-4 py-3 rounded-xl outline-none"
                style={{
                     background: 'rgba(255,255,255,0.75)',
                     border: '1px solid rgba(33,150,188,0.20)',}}
            />
          </div>

       
          <div>
            <label
              className="block text-sm font-semibold mb-2"
              style={{ color: '#4a6a77' }}
            >
              Content
            </label>

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start writing here..."
              className="w-full min-h-[400px] px-4 py-3 rounded-xl outline-none resize-none"
              style={{
                background: 'rgba(255,255,255,0.75)',
                border: '1px solid rgba(33,150,188,0.20)',
                color: '#0f2a35',
              }}
            />
          </div>

        
          <p
            className="text-sm mt-3"
            style={{ color: '#7a9aa8' }}
          >
            Words: {wordCount}
          </p>

       
          <div className="flex flex-wrap gap-3 mt-8">
            <button
              onClick={handleSaveDraft}
              className="px-3 py-1 rounded-3xl font-semibold"
              style={{
                border: '1px solid rgba(33,150,188,0.25)',
                color: '#1a6080',
                background: 'white',
              }}
            >
              Save Draft
            </button>

            <button
              onClick={handleAiAssist}
              className="px-3 py-1 rounded-3xl font-semibold text-white"
              style={{
                background:
                  'linear-gradient(135deg, #2196bc, #1a6080)',
              }}
            >
              AI Assist
            </button>

            <button
  onClick={handleSubmitForReview}
  className="px-3 py-1 rounded-3xl font-semibold text-white"
  style={{
    background:
      'linear-gradient(135deg, #28c840, #1e9c31)',
  }}
>
  Submit For Review
</button>
          </div>
        </div>
      </div>
    </div>
  )
}