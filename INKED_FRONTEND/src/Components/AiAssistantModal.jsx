import { toast } from "react-toastify";
import { Copy } from "lucide-react";
export default function AIAssistModal({
  showAiModal,
  setShowAiModal,

  loadingAI,
  runAI,

  currentAction,
  aiResult,

  setTitle,
  addTag,
  setIsDirty,

  replaceEditorContent,
}) {
  if (!showAiModal) return null;

  return (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div
  className="rounded-2xl p-6 w-[650px] max-h-[80vh] overflow-y-auto"
  style={{
    background: "linear-gradient(155deg, #eef8fb 0%, #d7f1f6 45%, #c2eaf3 100%)",
    border: "1px solid rgba(255,255,255,0.92)",
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
    boxShadow: "0 8px 40px rgba(26,96,128,0.12)",
  }}
>

      <h2 className="text-2xl font-bold mb-5">
        AI Assistant
      </h2>

      <div className="grid grid-cols-2 gap-3">

        <button
          onClick={() => runAI("title")}
         className="rounded-xl font-semibold p-3 transition-all duration-200 hover:scale-[1.02]"
style={{  
  background: "rgba(255,255,255,0.75)",
  border: "1px solid rgba(33,150,188,0.20)",
}}
        >
         Generate Titles
        </button>

        <button
          onClick={() => runAI("summarize")}
          className="rounded-xl font-semibold p-3 transition-all duration-200 hover:scale-[1.02]"
          style={{
            background: "rgba(255,255,255,0.75)",
            border: "1px solid rgba(33,150,188,0.20)",
          }}
        >
           Summarize
        </button>

        <button
          onClick={() => runAI("grammar")}
          className="rounded-xl font-semibold p-3 transition-all duration-200 hover:scale-[1.02]"
          style={{
            background: "rgba(255,255,255,0.75)",
            border: "1px solid rgba(33,150,188,0.20)",
          }}
        >
          Improve Grammar
        </button>

        <button
          onClick={() => runAI("rewrite")}
          className="rounded-xl font-semibold p-3 transition-all duration-200 hover:scale-[1.02]"
          style={{
            background: "rgba(255,255,255,0.75)",
            border: "1px solid rgba(33,150,188,0.20)",
          }}
        >
         Rewrite
        </button>

        <button
          onClick={() => runAI("seo")}
          className="rounded-xl font-semibold p-3 transition-all duration-200 hover:scale-[1.02] col-span-2"
          style={{
            background: "rgba(255,255,255,0.75)",
            border: "1px solid rgba(33,150,188,0.20)",
          }}
        >
         SEO Suggestions
        </button>

      </div>

      {loadingAI && (
        <div className="mt-6 text-center">
          <div
  className="mt-6 text-center py-8"
  style={{ color: "#4a6a77" }}
>
   Thinking...
</div>
        </div>
      )}

      {currentAction === "title" && aiResult?.titles && (
  <div className="mt-6">
    <h3 className="font-semibold mb-3">
      Suggested Titles
    </h3>

    <div className="space-y-3">
      {aiResult.titles.map((item, index) => (
        <button
          key={index}
          onClick={() => {
            setTitle(item);
            setShowAiModal(false);
            setIsDirty(true);
            
          }}
          className="w-full text-left border rounded-xl p-3 hover:bg-gray-100"
        >
          {item}
        </button>
      ))}
    </div>
    </div>
      )}
    {currentAction === "grammar" && aiResult?.content && (
  <div className="mt-6">

    <h3 className="font-semibold mb-3">
      Improved Grammar
    </h3>

    <textarea
      value={aiResult.content}
      readOnly
      rows={12}
      className="w-full border rounded-xl p-3"
    />

    <div className="flex justify-end mt-4">
      <button
        onClick={() => replaceEditorContent(aiResult.content)}
        className="px-5 py-2 rounded-xl text-white"
        style={{
          background: "linear-gradient(135deg,#28c840,#1e9c31)",
        }}
      >
        Replace Editor
      </button>
    </div>

  </div>
)}
{currentAction === "rewrite" && aiResult?.content && (
  <div className="mt-6">

    <h3 className="font-semibold mb-3">
      Rewritten Article
    </h3>

    <textarea
      value={aiResult.content}
      readOnly
      rows={12}
      className="w-full border rounded-xl p-3"
    />

    <div className="flex justify-end mt-4">
      <button
        onClick={() => replaceEditorContent(aiResult.content)}
        className="px-5 py-2 rounded-xl text-white"
        style={{
          background: "linear-gradient(135deg,#28c840,#1e9c31)",
        }}
      >
        Replace Editor
      </button>
    </div>

  </div>
)}

{currentAction === "summarize" && aiResult?.summary && (
  <div className="mt-6">

    <h3 className="font-semibold mb-3">
      Summary
    </h3>

    <div
      className="rounded-xl p-4"
      style={{
        background: "rgba(255,255,255,.75)",
        border: "1px solid rgba(33,150,188,.2)",
        whiteSpace: "pre-wrap",
      }}
    >
      {aiResult.summary}
    </div>

    <div className="flex justify-end mt-4">
      <button
        onClick={() => {
          navigator.clipboard.writeText(aiResult.summary);
          toast.success("Summary copied!");
        }}
        className="px-5 py-2 rounded-xl text-white"
        style={{
          background: "linear-gradient(135deg,#2196bc,#1a6080)",
        }}
      >
        Copy Summary
      </button>
    </div>

  </div>
)}
{currentAction === "seo" && aiResult?.seoTitle && (
  <div className="mt-6 space-y-4">

    
    

    <div className="rounded-xl p-4 border">
      <h4 className="font-semibold">Focus Keyword</h4>
      <div className="flex justify-between items-center mt-2">
  <p>{aiResult.focusKeyword}</p>

  <button
  onClick={() => {
    navigator.clipboard.writeText(aiResult.focusKeyword);
    toast.success("Keyword copied!");
  }}
>
  <Copy size={18} />
</button>
</div>
    </div>

    <div className="rounded-xl p-4 border">
      <h4 className="font-semibold mb-2">
        Suggested Tags
      </h4>

      <div className="flex flex-wrap gap-2">
        {aiResult.tags?.map((tag, index) => (
          <button
  key={index}
  onClick={() => addTag(tag)}
  className="px-3 py-1 rounded-full transition hover:scale-105"
  style={{
    background: "rgba(33,150,188,.12)",
    color: "#1a6080",
  }}
>
  {tag}
</button>
        ))}
      </div>
    </div>

    <div className="rounded-xl p-4 border">
      <h4 className="font-semibold mb-2">
        SEO Suggestions
      </h4>

      <ul className="list-disc ml-5">
        {aiResult.suggestions?.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>

  </div>
)}
  

      <div className="flex justify-end mt-6">

        <button
          onClick={() => setShowAiModal(false)}
          className="px-5 py-2 font-semibold rounded-xl bg-red-500 text-white"
        >
          Close
        </button>

      </div>

    </div>
  </div>
);
}