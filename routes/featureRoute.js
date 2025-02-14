const express = require("express");
const featureController = require("../controllers/featureController")
const serviceListingController = require("../controllers/serviceListingController")

const router = express.Router();

// Routes
router.post("/search", featureController.search);
router.get("/trusted-partners", featureController.trustedby);
router.post("/mark-trusted", featureController.updateTrustedby);


// Review 

router.post('/reviews', featureController.postReview);
router.get('/reviews', featureController.getReviews);
router.get('/singlereviews', featureController.getReviewsForIndividual);
router.patch('/reviews/:id/approve', featureController.approveReview);
router.put('/reviews/:id', featureController.editReview);
router.delete('/reviews/:id', featureController.deleteReview);

// email subscribe 

router.post('/subscribe', featureController.addSubscription); // Add a new subscription
router.get('/subscribers', featureController.getSubscribers); // Get all subscribers
router.patch('/unsubscribe', featureController.unsubscribe); // Unsubscribe an email
router.get('/check-subscription', featureController.checkSubscription); // Check subscription status


// email subscribe 

router.post('/resources', featureController.addResource); // Add a new resource
router.get('/resources', featureController.getAllResources); // Get all resources
router.get('/resources/:id', featureController.getResourceById); // Get a specific resource by ID
router.get('/resources/category/:category', featureController.getResourcesByCategory); // Get resources by category
router.put('/resources/:id', featureController.updateResource); // Update a specific resource
router.delete('/resources/:id', featureController.deleteResource); // Delete a specific resource




router.post('/enquiry', featureController.enquiry); // post enquiry
router.get('/enquiry', featureController.getAllEnquiries); // get enquiry


// Route to add a viewing request
router.post("/add", featureController.addRequest);

// Route to clear all requests
router.post("/clear", featureController.clearRequests);


// Route for submit-viewing
router.post('/submit-viewing', featureController.submitViewing);

// Route for clearing the database
router.post('/clear-db', featureController.clearDb);



// Tailor Request Api Routes
router.post('/requests', featureController.createRequest);
router.get('/requests', featureController.getRequests);
router.get('/requests/:id', featureController.getRequestById);
router.put('/requests/:id', featureController.updateRequest);
router.delete('/requests/:id', featureController.deleteRequest);




module.exports = router;
