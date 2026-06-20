const express = require("express");
const Blog = require("../models/Blog");

const authMiddleware =
  require("../middleware/authMiddleware");

const adminMiddleware =
  require("../middleware/adminMiddleware");

const router = express.Router();

router.use(authMiddleware);
router.use(adminMiddleware);

router.get("/pending", async (req, res) => {
  try {

    const blogs = await Blog.find({
      status: "pending"
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
});

router.put("/approve/:id", async (req, res) => {
  try {

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found"
      });
    }

    // CASE 1:
    // This is a revision of an already published blog

    if (blog.originalBlog) {

      const originalBlog =
        await Blog.findById(blog.originalBlog);

      if (!originalBlog) {
        return res.status(404).json({
          message: "Original blog not found"
        });
      }

      originalBlog.title = blog.title;
      originalBlog.content = blog.content;
      originalBlog.tags = blog.tags;

      await originalBlog.save();

      await Blog.findByIdAndDelete(blog._id);

      return res.status(200).json({
        message:
          "Revision approved and published blog updated"
      });
    }

    // CASE 2:
    // First-time submission

    blog.status = "published";

    await blog.save();

    res.status(200).json({
      message: "Blog approved"
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
});

router.put("/reject/:id", async (req, res) => {
  try {

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found"
      });
    }

    // Revision rejection
    if (blog.originalBlog) {

      await Blog.findByIdAndDelete(blog._id);

      return res.status(200).json({
        message: "Revision rejected"
      });
    }

    // First-time submission rejection

    blog.status = "rejected";

    blog.rejectionReason =
      req.body.reason || "";

    await blog.save();

    res.status(200).json({
      message: "Blog rejected"
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
});

router.delete("/blog/:id", async (req, res) => {
  try {

    await Blog.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({
      message: "Blog deleted"
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
});

module.exports = router;