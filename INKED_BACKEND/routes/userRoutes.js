const express = require("express");
const router = express.Router();

const User = require("../models/Users");
const Blog = require("../models/Blog");

const authMiddleware = require("../middleware/authMiddleware");
router.get(
  "/:username",
  async (req, res) => {
    try {

      const user =
        await User.findOne({
          username:
            req.params.username,
        }).select(
          "-password -tokenVersion"
        );

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      const blogs =
  await Blog.find({
    author: user._id,
    status: "published",
  })
    .select(
      "title slug content tags createdAt"
    )
          .sort({
            createdAt: -1,
          });

      res.status(200).json({
        user,
        blogs,
      });

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });

    }
  }
);

router.put(
  "/me",
  authMiddleware,
  async (req, res) => {
    try {

      const { username, bio } = req.body;

      const user = await User.findByIdAndUpdate(
        req.user.userId,
        {
          username,
          bio,
        },
        { new: true }
      );

      res.status(200).json(user);

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });

    }
  }
);

module.exports = router;