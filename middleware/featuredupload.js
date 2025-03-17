const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Function to dynamically create and return the upload path
const getUploadPath = (req) => {
  const category = req.body.category || "general"; // Use category from request, default to 'general'
  const uploadDir = `./images/${category}/`;

  console.log('=============req.body.category =======================');
  console.log(req.body);
  console.log('====================================');

  // Ensure the directory exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    fs.chmodSync(uploadDir, 0o777);
  }

  return uploadDir;
};

// Set up Multer storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = getUploadPath(req); // Get dynamic upload directory
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    if (!file) {
      return cb(new Error("No file uploaded"), null);
    }
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Rename file uniquely
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
