
const express = require("express");
const multer = require("multer");
const { analyzeResume } = require("../controllers/analysisController");

const router = express.Router();

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, callback) => {
    if (file.mimetype !== "application/pdf") {
      return callback(new Error("Only PDF files are allowed."));
    }

    callback(null, true);
  }
});

router.post("/analyze", (req, res, next) => {
  upload.single("resume")(req, res, (error) => {
    if (error) {
      if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          message: "File too large. Please upload a PDF under 5 MB."
        });
      }

      return res.status(400).json({
        message: error.message || "Invalid file upload."
      });
    }

    next();
  });
}, analyzeResume);

module.exports = router;
