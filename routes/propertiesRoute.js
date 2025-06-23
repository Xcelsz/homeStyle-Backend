const express = require("express");
const propertiesController = require("../controllers/propertiesController")

const router = express.Router();

// Routes
router.get("/properties", propertiesController.getProperties);
// router.post("/trusted-partners", featureController.trustedby);
// router.post("/mark-trusted", featureController.updateTrustedby);
// router.get("/", serviceListingController.getAllServiceListings);
// router.get("getbyId/:id", serviceListingController.getServiceListingById);
// // router.put("/:id", upload.single("media"), serviceListingController.updateServiceListing);
// router.delete("delete/:id", serviceListingController.deleteServiceListing);
// router.put("/update-status", serviceListingController.updateServiceListingStatus);
// router.get("/overview", serviceListingController.getServiceStats);

module.exports = router;
