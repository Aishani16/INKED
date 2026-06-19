const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    content: {
      type: String,
      required: true,
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    status: {
  type: String,
  enum: [
    "draft",
    "pending",
    "published",
    "rejected"
  ],
  default: "draft",
},

originalBlog: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Blog",
  default: null,
},

rejectionReason: {
  type: String,
  default: "",
},

    tags: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Blog", blogSchema);