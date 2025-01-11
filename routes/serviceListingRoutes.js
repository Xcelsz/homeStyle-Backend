const express = require("express");
const multer = require("multer");
const serviceListingController = require("../controllers/serviceListingController");

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Routes
router.post("/", upload.single("media"), serviceListingController.createServiceListing);
router.get("/", serviceListingController.getAllServiceListings);
router.get("/:id", serviceListingController.getServiceListingById);
router.put("/:id", upload.single("media"), serviceListingController.updateServiceListing);
router.delete("/:id", serviceListingController.deleteServiceListing);

module.exports = router;
