const express = require("express");
const Blog = require("../models/Blog");
const authMiddleware = require("../middleware/authMiddleware");
const optionalAuth =
require("../middleware/optionalAuth");

const router = express.Router();

{/*CREATE A BLOG */}
router.post(
  "/create",
  authMiddleware,
  async (req, res) => {
    try {

      const { title, content, tags } = req.body;

      const blog = await Blog.create({
        title,
        content,
        tags,
        status: "draft",
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

    
    const blogs = await Blog.find({
  status: "published"
});

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

router.put(
  "/submit/:id",
  authMiddleware,
  async (req, res) => {
    try {

      const blog = await Blog.findById(
        req.params.id
      );

      if (!blog) {
        return res.status(404).json({
          message: "Blog not found"
        });
      }

      if (
        blog.author.toString() !==
        req.user.userId
      ) {
        return res.status(403).json({
          message: "Not authorized"
        });
      }

      blog.status = "pending";

      await blog.save();

      res.status(200).json({
        message: "Submitted for review",
        blog
      });

    } catch (error) {

      res.status(500).json({
        message: error.message
      });

    }
  }
);

{/*GET SINGLE BLOG BY ID*/}
router.get(
  "/:id",
  optionalAuth,
  async (req, res) => {
    try {

      const blog =
        await Blog.findById(
          req.params.id
        ).populate(
          "author",
          "username email"
        );

      if (!blog) {
        return res.status(404).json({
          message: "Blog not found"
        });
      }

      if (blog.status === "published") {
        return res.status(200).json(blog);
      }

      if (!req.user) {
        return res.status(403).json({
          message: "Access denied"
        });
      }

      const isOwner =
        blog.author._id.toString() ===
        req.user.userId;

      const isAdmin =
        req.user.role === "admin";

      if (!isOwner && !isAdmin) {
        return res.status(403).json({
          message: "Access denied"
        });
      }

      res.status(200).json(blog);

    } catch (error) {

      res.status(500).json({
        message: error.message
      });

    }
  }
);

{/*UPDATE BLOG*/}

router.put("/:id", authMiddleware, async (req, res) => {
  try {

  if (req.body.status) {
    delete req.body.status;
  }

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