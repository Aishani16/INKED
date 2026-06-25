const express = require("express");
const router = express.Router();

const Comment = require("../models/Comment");
const Blog = require("../models/Blog");

const authMiddleware =
  require("../middleware/authMiddleware");
  
  
  router.post(
  "/:blogId",
  authMiddleware,
  async (req, res) => {
    try {
      const { text } = req.body;

      const blog = await Blog.findById(
        req.params.blogId
      );

      if (!blog) {
        return res.status(404).json({
          message: "Blog not found",
        });
      }

      const comment =
        await Comment.create({
          blog: blog._id,
          user: req.user.userId,
          text,
        });

      const populated =
        await Comment.findById(
          comment._id
        ).populate(
          "user",
          "username email"
        );

      res.status(201).json(populated);

    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

router.get(
  "/:blogId",
  async (req, res) => {
    try {

      const comments =
        await Comment.find({
          blog: req.params.blogId,
        })
          .populate(
            "user",
            "username email"
          )
          .sort({
            createdAt: -1,
          });

      res.status(200).json(
        comments
      );

    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

router.delete(
  "/:commentId",
  authMiddleware,
  async (req, res) => {
    try {

      const comment =
        await Comment.findById(
          req.params.commentId
        );

      if (!comment) {
        return res.status(404).json({
          message: "Comment not found",
        });
      }

      const isOwner =
        comment.user.toString() ===
        req.user.userId;

      const isAdmin =
        req.user.role === "admin";

      if (!isOwner && !isAdmin) {
        return res.status(403).json({
          message: "Not authorized",
        });
      }

      await Comment.findByIdAndDelete(
        comment._id
      );

      res.status(200).json({
        message: "Comment deleted",
      });

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });

    }
  }
);

module.exports = router;