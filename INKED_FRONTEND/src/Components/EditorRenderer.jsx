export default function EditorRenderer({ post }) {
  return (
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

        case "image":
  return (
    <figure key={block.id} className="my-6">
      <img
        src={block.data.file.url}
        alt={block.data.caption || "Blog image"}
        className="w-full rounded-xl"
      />

      {block.data.caption && (
        <figcaption className="mt-2 text-center text-sm text-gray-500 italic">
          {block.data.caption}
        </figcaption>
      )}
    </figure>
  );

          default:
            return null;
        }
      })}
    </div>
  );
}
     
        

      