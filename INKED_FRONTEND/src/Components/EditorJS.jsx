import { useEffect, useRef } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Checklist from "@editorjs/checklist";
import Quote from "@editorjs/quote";
import Code from "@editorjs/code";
import Delimiter from "@editorjs/delimiter";
import Table from "@editorjs/table";
import Embed from "@editorjs/embed";
import Paragraph from "@editorjs/paragraph";
import "../Styles/editor.css";
import ImageTool from "@editorjs/image";
import Underline from "@editorjs/underline";
import Marker from "@editorjs/marker";
import InlineCode from "@editorjs/inline-code";
import Strikethrough from "@sotaproject/strikethrough";

export default function EditorJSComponent({
  data,
  onChange,
}) {
  const editorRef = useRef(null);
  const holderRef = useRef(null);

  useEffect(() => {
    if (editorRef.current) return;

    const editor = new EditorJS({
      holder: holderRef.current,

      data:
        data && data.blocks
          ? data
          : {
              time: Date.now(),
              blocks: [],
              version: "2.31.6",
            },

      placeholder: "Start writing...",

      async onChange() {
  const output = await editor.save();
  console.log(output);
  onChange(output);
},

      tools: {
        header: {
  class: Header,
  inlineToolbar: true,
  config: {
    placeholder: "Heading",
    levels: [1, 2, 3, 4, 5, 6],
    defaultLevel: 2,
  },
},

    paragraph: {
  class: Paragraph,
  inlineToolbar: true,
  toolbox: {
    title: "Paragraph",
  },
},
underline: Underline,

marker: Marker,

inlineCode: InlineCode,

strikethrough: Strikethrough,

         list: {
    class: List,
    inlineToolbar: true,
  },

  // checklist: {
  //   class: Checklist,
  //   inlineToolbar: true,
  // },

  quote: {
    class: Quote,
    inlineToolbar: true,
  },

  code: {
    class: Code,
  },

  delimiter: {
    class: Delimiter,
  },

  table: {
    class: Table,
  },

        embed: {
  class: Embed,

  toolbox: {
    title: "Embed",
    icon: `
      <svg width="17" height="15" viewBox="0 0 17 15">
        <path d="M10 2L15 7L10 12M7 2L2 7L7 12"
          stroke="currentColor"
          stroke-width="2"
          fill="none"/>
      </svg>
    `,
  },

  config: {
    services: {
      youtube: true,
      vimeo: true,
      codepen: true,
    },
  },
},
image: {
  class: ImageTool,
  config: {
    endpoints: {
      byFile: "http://localhost:5000/api/uploads",
    },
  },
},
      },
    });

    editorRef.current = editor;

    return () => {
      editor.destroy();
      editorRef.current = null;
    };
  }, []);

  const hasRenderedInitialData = useRef(false);

useEffect(() => {
  if (!editorRef.current) return;
  if (!data?.blocks) return;
  if (hasRenderedInitialData.current) return;

  editorRef.current.isReady.then(() => {
    editorRef.current.render(data);
    hasRenderedInitialData.current = true;
  });
}, [data]);

  return (

  <div
    ref={holderRef}
    className="relative w-full min-h-500px rounded-xl p-6"
    style={{
      background: "#fff",
      border: "1px solid rgba(33,150,188,0.20)",
    }}
  />

);
}