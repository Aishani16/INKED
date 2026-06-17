const express = require("express");
const Blog = require("../models/Blog");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

{/*CREATE A BLOG */}
router.post(
  "/create",
  authMiddleware,
  async (req, res) => {
    try {

      const { title, content, tags, status } = req.body;

      const blog = await Blog.create({
        title,
        content,
        tags,
        status,
        author: req.user.userId
      });

      res.status(201).json(blog); 

    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  }
);
{/*GET ALL BLOGS*/}

router.get("/published", async (req, res) => {
  try {
    const blogs = await Blog.find({
      status: "published"
    });

    res.status(200).json(blogs);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
});

router.get("/", async (req, res) => {
  try {

    const blogs = await Blog.find();

    res.status(200).json(blogs); {/*this 'blog' here basically is the array of objects
        i.e all the blogs, where each blog post is an object*/} 

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
});

router.get(
  "/myblogs",
  authMiddleware,
  async (req, res) => {
    try {

      const blogs = await Blog.find({
        author: req.user.userId
      }).populate(
        "author",
        "username email"
      );

      res.status(200).json(blogs);

    } catch (error) {

      res.status(500).json({
        message: error.message
      });

    }
  }
);

{/*GET SINGLE BLOG BY ID*/}
router.get("/:id", async (req, res) => {
  try {

    const blog = await Blog.findById(req.params.id).populate(
      "author",
      "username email"
    );

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found"
      });
    }

    res.status(200).json(blog);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
});

{/*UPDATE BLOG*/}

router.put("/:id", authMiddleware, async (req, res) => {
  try {

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found"
      });
    }

    // Only author can edit
    if (blog.author.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "Not authorized"
      });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedBlog);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
});

{/*DELETE BLOG*/}

router.delete("/:id", authMiddleware, async (req, res) => {
  try {

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found"
      });
    }

    if (blog.author.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "Not authorized"
      });
    }

    await Blog.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Blog deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
});

module.exports = router;