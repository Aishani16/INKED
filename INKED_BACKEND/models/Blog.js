const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    content: {
  type: mongoose.Schema.Types.Mixed,
  required: true,
},
    slug: {
  type: String,
  unique: true,
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
        "rejected",
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

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  },
  
);

module.exports = mongoose.model("Blog", blogSchema);