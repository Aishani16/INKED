const express = require("express");
const multer = require("multer");
const streamifier = require("streamifier");
const cloudinary = require("../config/cloudinary");

const router = express.Router();

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: 0,
        message: "No image uploaded",
      });
    }

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "inked/blog-images",
      },
      (error, result) => {
        if (error) {
          return res.status(500).json({
            success: 0,
            message: error.message,
          });
        }

        return res.status(200).json({
          success: 1,
          file: {
            url: result.secure_url,
          },
        });
      }
    );

    streamifier.createReadStream(req.file.buffer).pipe(stream);

  } catch (error) {
  console.error(error);

  res.status(500).json({
    success: 0,
    message: error.message,
  });
}
});

module.exports = router;