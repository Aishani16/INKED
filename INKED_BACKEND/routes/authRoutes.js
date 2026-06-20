const Blog = require("../models/Blog");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const authMiddleware = require("../middleware/authMiddleware");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/Users");
const express = require("express");

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {

    const { username, email, password } = req.body;
    if (!username || !email || !password) {
  return res.status(400).json({
    message: "All fields are required"
  });
}

    const emailRegex = /^\S+@\S+\.\S+$/;

if (!emailRegex.test(email)) {
  return res.status(400).json({
    message: "Invalid email format"
  });
}

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword
    });

    res.status(201).json(user);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});


router.post("/login", async (req, res) => {
  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found"
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid password"
      });
    }

    const token = jwt.sign(
  {
    userId: user._id,
    role: user.role,
    tokenVersion: user.tokenVersion
  },
  process.env.JWT_SECRET,
  {
    expiresIn: "7d"
  }
);

res.status(200).json({
  message: "Login successful",
  token,
  username: user.username,
  role: user.role
});

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

router.post("/google", async (req, res) => {
  try {

    const { credential } = req.body;

    const ticket =
      await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

    const payload = ticket.getPayload();

    const {
      sub,
      email,
      name,
      picture
    } = payload;

    let user = await User.findOne({ email });

    if (!user) {

      user = await User.create({
        username: name,
        email,
        googleId: sub,
        avatar: picture,
      });

    }

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
        tokenVersion: user.tokenVersion
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      token,
      username: user.username,
      role: user.role,
    });

  } catch (error) {

    res.status(500).json({
      message: "Google login failed",
    });

  }
});

router.get(
  "/profile",
  authMiddleware,
  async (req, res) => {

    res.json({
      message: "Protected profile route",
      user: req.user
    });

  }
);
router.post(
  "/logout",
  authMiddleware,
  async (req, res) => {
    try {

      const user =
        await User.findById(
          req.user.userId
        );

      if (!user) {
        return res.status(404).json({
          message: "User not found"
        });
      }

      user.tokenVersion += 1;

      await user.save();

      res.status(200).json({
        message: "Logged out"
      });

    } catch (error) {

      res.status(500).json({
        message: error.message
      });

    }
  }
);

router.post(
  "/bookmark/:blogId",
  authMiddleware,
  async (req, res) => {
    try {

      const user = await User.findById(
        req.user.userId
      );

      const blog = await Blog.findById(
        req.params.blogId
      );

      if (!blog) {
        return res.status(404).json({
          message: "Blog not found"
        });
      }

      if (
        user.bookmarks.includes(blog._id)
      ) {
        return res.status(400).json({
          message: "Already bookmarked"
        });
      }

      user.bookmarks.push(blog._id);

      await user.save();

      res.status(200).json({
        message: "Blog bookmarked"
      });

    } catch (error) {

      res.status(500).json({
        message: error.message
      });

    }
  }
);

router.get(
  "/bookmarks",
  authMiddleware,
  async (req, res) => {
    try {

      const user =
        await User.findById(
          req.user.userId
        ).populate("bookmarks");

      res.status(200).json(
        user.bookmarks
      );

    } catch (error) {

      res.status(500).json({
        message: error.message
      });

    }
  }
);
router.delete(
  "/bookmark/:blogId",
  authMiddleware,
  async (req, res) => {
    try {

      const user = await User.findById(
        req.user.userId
      );

      user.bookmarks =
        user.bookmarks.filter(
          (id) =>
            id.toString() !==
            req.params.blogId
        );

      await user.save();

      res.status(200).json({
        message:
          "Bookmark removed"
      });

    } catch (error) {

      res.status(500).json({
        message: error.message
      });

    }
  }
);


module.exports = router;