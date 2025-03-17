const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure `./images/` directory exists
const uploadPath = "./images/";
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Set up Multer storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath); // Store files in `./images/`
  },
  filename: function (req, file, cb) {
    if (!file) {
      return cb(new Error("No file uploaded"), null);
    }
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Rename file
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed"), false);
    }
    cb(null, true);
  },
});

module.exports = upload;
