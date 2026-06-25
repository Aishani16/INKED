const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
   username: {
    type: String,
    required: true,
  },

  email: {
  type: String,
  required: true,
  unique: true,
  match: [
    /^\S+@\S+\.\S+$/,
    "Please enter a valid email address"
  ]
},

  password: {
    type: String,
  },

  googleId: {
    type: String,
  },

  avatar: {
    type: String,
  },
  bio: {
  type: String,
  default: "",
},
  role: {
  type: String,
  enum: ["author", "admin"],
  default: "author",
},

  tokenVersion: {
  type: Number,
  default: 0,
},

bookmarks: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Blog",
  },
],
},

{
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);