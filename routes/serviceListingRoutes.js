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


// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const uploadPath = path.join(__dirname, 'uploads');
//     if (!fs.existsSync(uploadPath)) {
//       fs.mkdirSync(uploadPath); // Create the directory if it doesn't exist
//     }
//     cb(null, uploadPath);
//   },
//   filename: (req, file, cb) => {
//     const filename = `${Date.now()}_${file.originalname}`;
//     cb(null, filename);
//   },
// });

// const upload = multer({ storage });

// Routes
router.post("/service", upload.single("media"), serviceListingController.createServiceListing);
router.post("/property", upload.single("media"), serviceListingController.createPropertyListing);
router.get("/", serviceListingController.getAllListings);
router.get("/service", serviceListingController.getAllServiceListings);
router.get("/property", serviceListingController.getAllPropertyListings);
router.get("/getById/:id", serviceListingController.getServiceListingById);
router.delete("/:id", serviceListingController.deleteServiceListing);
router.put("/update-status", serviceListingController.updateServiceListingStatus);
router.get("/overview", serviceListingController.getServiceStats);


module.exports = router;
