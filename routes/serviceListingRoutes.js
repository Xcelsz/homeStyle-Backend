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

// Upload field configurations
const multipleUploads = upload.fields([
  { name: "media", maxCount: 10 },
  { name: "floorPlans", maxCount: 5 },
  { name: "ownership", maxCount: 5 },
  { name: "frontMedia", maxCount: 1 }
]);

const editUploads = upload.fields([
  { name: "displayImages", maxCount: 10 },
  { name: "floorPlanPaths", maxCount: 5 },
  { name: "ownership", maxCount: 5 }
]);

// Listing Routes
router.post("/listing", multipleUploads, serviceListingController.createListing);
router.put("/edit-listing", editUploads, serviceListingController.editListing);

// Service Routes
router.post("/service", upload.single("media"), serviceListingController.createServiceListing);
router.get("/service", serviceListingController.getAllServiceListings);
router.get("/published-service", serviceListingController.getAllServiceListings);

// Property Routes
router.post("/property", multipleUploads, serviceListingController.createPropertyListing);
router.get("/property", serviceListingController.getAllProperties);
router.get("/published-property", serviceListingController.getPublishedProperties);
router.get("/client-published", serviceListingController.getSixPublishedProperties);

// Addons Routes
router.get("/addons", serviceListingController.getAllAddons);
router.get("/published-addons", serviceListingController.getPublishedAddons);

// Resource Routes
router.post("/create-resource", serviceListingController.createResource);
router.get("/all-resource", serviceListingController.getResource);
router.get("/resource", serviceListingController.getResource);
router.get("/published-resource", serviceListingController.getPublishedResources);

// Miscellaneous Routes
router.get("/", serviceListingController.getAllListings);
router.get("/overview", serviceListingController.getServiceStats);
router.get("/getById/:id/:listingType", serviceListingController.getListingDetails);
router.put("/update-status", serviceListingController.updateServiceListingStatus);
router.delete("/:id", serviceListingController.deleteServiceListing);

module.exports = router;
