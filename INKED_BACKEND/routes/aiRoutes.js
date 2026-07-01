const express = require("express");
const router = express.Router();

const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

router.post("/", async (req, res) => {
  try {
    const { action, content } = req.body;

    if (!action || !content) {
      return res.status(400).json({
        success: false,
        message: "Action and content are required.",
      });
    }

    let prompt = "";

    switch (action) {
      case "title":
        prompt = `Generate 5 engaging blog titles for the following article.
        
Return ONLY valid JSON.

{
  "titles": [
    "...",
    "...",
    "...",
    "...",
    "..."
  ]
}



Article:
${content}`;
        break;

      case "summarize":
        prompt = `Summarize the following article . Ensure that it is highly engaging and suitable for social media sharing. Return ONLY valid JSON.

{
  "summary": "..."
}

Article:
${content}`;
        break;

      case "grammar":
        prompt = `Improve the grammar of the following article without changing its meaning or tone.
Return ONLY valid JSON.

{
  "content":"corrected article"
}
Article:
${content}`;
        break;

      case "rewrite":
        prompt = `Rewrite the following article to make it more engaging and readable while preserving all important information.

Return ONLY valid JSON.

{
  "content": "rewritten article"
}

Article:
${content}`;
        break;

      case "seo":
        prompt = `Analyze this article and provide:

1. A very engaging and punchy SEO Title
2. Meta Description
3. Focus Keyword
4. Suggested Tags
5. Suggestions to improve SEO
Return ONLY valid JSON.
{
  "seoTitle":"",
  "metaDescription":"",
  "focusKeyword":"",
  "tags":["","",""],
  "suggestions":[
    "",
    "",
    ""
  ]
}

Article:
${content}`;
        break;

      default:
        return res.status(400).json({
          success: false,
          message: "Invalid AI action.",
        });
    }

    const completion = await groq.chat.completions.create({
  model: "llama-3.3-70b-versatile",
  messages: [
    {
      role: "user",
      content: prompt,
    },
  ],
  temperature: 0.6,
});

let text = completion.choices[0].message.content.trim();



// Remove markdown fences if Gemini wraps the JSON
text = text.replace(/```json/g, "").replace(/```/g, "").trim();

let result;

try {
  result = JSON.parse(text);
} catch (err) {
  console.error("Invalid JSON from Gemini:", text);

  return res.status(500).json({
    success: false,
    message: "AI returned invalid JSON.",
  });
}

res.json({
  success: true,
  result,
});
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "AI request failed.",
    });
  }
});

module.exports = router;