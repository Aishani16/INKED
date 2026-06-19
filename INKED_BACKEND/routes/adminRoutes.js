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

    const blog = await Blog.findById(
      req.params.id
    );

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found"
      });
    }

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

    const blog = await Blog.findById(
      req.params.id
    );

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found"
      });
    }

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