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

    if (blog.author.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "Not authorized"
      });
    }

    // CASE 1: Draft or Rejected → normal update
    if (
      blog.status === "draft" ||
      blog.status === "rejected"
    ) {

      const updatedBlog =
        await Blog.findByIdAndUpdate(
          req.params.id,
          req.body,
          { new: true }
        );

      return res.status(200).json(updatedBlog);
    }

    // CASE 2: Published → create revision
    if (blog.status === "published") {

      const existingRevision =
        await Blog.findOne({
          originalBlog: blog._id,
          status: "pending"
        });

      if (existingRevision) {
        return res.status(400).json({
          message:
            "A pending revision already exists for this blog"
        });
      }

      const revision = await Blog.create({
        title: req.body.title ?? blog.title,
        content: req.body.content ?? blog.content,
        tags: req.body.tags ?? blog.tags,

        author: blog.author,

        status: "pending",

        originalBlog: blog._id
      });

      return res.status(200).json({
        message:
          "Revision submitted for admin review",
        revision
      });
    }

    // CASE 3: Pending
    if (blog.status === "pending") {

      const updatedPending =
        await Blog.findByIdAndUpdate(
          req.params.id,
          req.body,
          { new: true }
        );

      return res.status(200).json(updatedPending);
    }

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

    const isAuthor =
      blog.author.toString() === req.user.userId;

    const isAdmin =
      req.user.role === "admin";

    if (!isAuthor && !isAdmin) {
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
router.post(
  "/:id/like",
  authMiddleware,
  async (req, res) => {
    try {
      const blog = await Blog.findById(
        req.params.id
      );

      if (!blog) {
        return res.status(404).json({
          message: "Blog not found",
        });
      }

      const userId = req.user.userId;

      if (
        blog.likes.includes(userId)
      ) {
        return res.status(400).json({
          message: "Already liked",
        });
      }

      blog.likes.push(userId);

      await blog.save();

      res.status(200).json({
        message: "Blog liked",
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);
router.delete(
  "/:id/like",
  authMiddleware,
  async (req, res) => {
    try {
      const blog = await Blog.findById(
        req.params.id
      );

      if (!blog) {
        return res.status(404).json({
          message: "Blog not found",
        });
      }

      blog.likes =
        blog.likes.filter(
          (id) =>
            id.toString() !==
            req.user.userId
        );

      await blog.save();

      res.status(200).json({
        message: "Like removed",
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

module.exports = router;