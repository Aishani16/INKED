import EditorJSComponent from "../Components/EditorJS";
import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import api from '../services/api'
import { toast } from "react-toastify";

export default function Editor() {
  const navigate = useNavigate();
const { id } = useParams();

// For new articles, draftId starts as null.
// For existing articles, draftId is the URL id.
const [draftId, setDraftId] = useState(id || null);

const [title, setTitle] = useState("");

const [content, setContent] = useState({
  time: Date.now(),
  blocks: [],
  version: "2.31.6",
});

const [tags, setTags] = useState("");

const [isLoaded, setIsLoaded] = useState(false);
const [editorReady, setEditorReady] = useState(!id);

const [saveStatus, setSaveStatus] = useState("saved");

// This will prevent autosave immediately after loading a draft
const [isDirty, setIsDirty] = useState(false);
  useEffect(() => {
  if (id) return
  

  const savedDraft =
    localStorage.getItem("editorDraft")

  if (savedDraft) {
    try {
      const parsed = JSON.parse(savedDraft)

      setTitle(parsed.title || "")
      setContent(
  parsed.content || {
    time: Date.now(),
    blocks: [],
    version: "2.31.6",
  }
);
      setTags(parsed.tags || "")
      setIsDirty(false);
    } catch (error) {
      console.error(error)
    }
  }

  setIsLoaded(true)
  setEditorReady(true);

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
  `/blogs/edit/${id}`,
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

    setContent(
  response.data.content || {
    time: Date.now(),
    blocks: [],
    version: "2.31.6",
  }

  
);

setDraftId(id);
setIsDirty(false);
setEditorReady(true);


  } catch (error) {
    console.error(error)
  }
}

  fetchBlog()

}, [id])

useEffect(() => {
  if (!editorReady) return;

  if (!isDirty) return;

  const timer = setTimeout(() => {
    saveDraft(true);
  }, 3000);

  return () => clearTimeout(timer);

}, [
  title,
  content,
  tags,
  isDirty,
  editorReady,
]);
  const wordCount = content?.blocks
  ? content.blocks.reduce((total, block) => {
      let text = "";

      switch (block.type) {
        case "paragraph":
        case "header":
        case "quote":
          text = block.data.text || "";
          break;

        case "list":
          text = (block.data.items || []).join(" ");
          break;

        case "checklist":
          text = (block.data.items || [])
            .map(item => item.text)
            .join(" ");
          break;

        case "code":
          text = block.data.code || "";
          break;

        default:
          text = "";
      }

      // remove HTML tags (<b>, <i>, etc.)
      text = text.replace(/<[^>]*>/g, "");

      return (
        total +
        (text.trim()
          ? text.trim().split(/\s+/).length
          : 0)
      );
    }, 0)
  : 0;

  async function saveDraft(silent = false) {
  const token = localStorage.getItem("token");

  if (!token) return null;

  if (!title.trim()) return null;

  if (!content?.blocks?.length) return null;

  try {
    setSaveStatus("saving");

    let response;

    const payload = {
      title,
      content,
      tags: tags
        .split(",")
        .map(tag => tag.trim())
        .filter(Boolean),
    };

    if (draftId) {
      response = await api.put(
        `/blogs/${draftId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } else {
      response = await api.post(
        "/blogs/create",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newId = response.data._id;

      setDraftId(newId);

      navigate(`/editor/${newId}`, {
        replace: true,
      });
      localStorage.removeItem("editorDraft");
    }

    setSaveStatus("saved");
    setIsDirty(false);

    if (!silent) {
      toast.success("Draft saved");
    }

    return response.data;
  } catch (error) {
    console.error(error);

    setSaveStatus("error");

    if (!silent) {
      toast.error("Failed to save draft");
    }

    return null;
  }
}

  async function handleSaveDraft() {
  await saveDraft(false);
}

async function handleSubmitForReview() {
  const token = localStorage.getItem("token");

  if (!token) {
    toast.error("Please login first");
    return;
  }

  if (!title.trim()) {
    toast.warning("Please enter a title");
    return;
  }

  if (!content.blocks?.length) {
    toast.warning("Please write some content");
    return;
  }

  try {
    let blogId;

    // Existing blog
    if (draftId) {
      const updateResponse = await api.put(
        `/blogs/${draftId}`,
        {
          title,
          content,
          tags: tags
            .split(",")
            .map(tag => tag.trim())
            .filter(Boolean),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Published blog revision
      if (updateResponse.data.revision) {
        toast.success(
          "Revision submitted for admin review"
        );

        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);

        return;
      }

      blogId = draftId;
    }

    // Brand new blog
    else {
      const createResponse = await api.post(
        "/blogs/create",
        {
          title,
          content,
          tags: tags
            .split(",")
            .map(tag => tag.trim())
            .filter(Boolean),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      blogId = createResponse.data._id;
    }

    await api.put(
      `/blogs/submit/${blogId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    localStorage.removeItem("editorDraft");

    toast.success(
      "Article submitted for review"
    );

    setTimeout(() => {
      navigate("/dashboard");
    }, 1000);

  } catch (error) {
    console.error(error);

    toast.error(
      error.response?.data?.message ||
      "Submission failed"
    );
  }
}

  function handleAiAssist() {
    toast.info("AI Assist coming soon");
  }
console.log(JSON.stringify(content, null, 2));
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
            {draftId ? "Edit Article" : "Write Article"}
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
              onChange={(e) => {
  setTitle(e.target.value);
  setIsDirty(true);
}}
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
                onChange={(e) => {
  setTags(e.target.value);
  setIsDirty(true);
}}
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

            {editorReady && (
  <div className="relative">
  <EditorJSComponent
  data={content}
  onChange={(data) => {
    setContent(data);
    setIsDirty(true);
  }}
/>
</div>
)}
          </div>

        
          <p
  className="text-sm mt-3"
  style={{ color: "#7a9aa8" }}
>
  Words: {wordCount}
</p>
<p
  className="text-sm mt-4"
  style={{ color: "#7a9aa8" }}
>
  {saveStatus === "saving" && "Saving..."}
  {saveStatus === "saved" && " Saved"}
  {saveStatus === "error" && " Failed to save"}
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