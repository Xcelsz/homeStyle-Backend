const express = require("express");
const router = express.Router();
const upload = require("../middleware/featuredupload"); // ✅ Import the separate `upload` middleware
const featureController = require("../controllers/featureController");

// ✅ Team Member Routes (Fixed)
router.post("/team/add", upload.single("media"), featureController.addTeamMember);
router.post("/partners/add", upload.single("media"), featureController.addtrustedby);

router.get("/team/all", featureController.getAllTeamMembers);
router.get("/team/:id", featureController.getTeamMemberById);
router.put("/team/update/:id", featureController.updateTeamMember);
router.delete("/team/delete/:id", featureController.deleteTeamMember);

// ✅ Trusted Partners Routes
router.get("/partners/list", featureController.trustedby);
router.post("/mark-trusted", featureController.updateTrustedby);
router.delete("/partners/delete", featureController.deletePartner);
router.put("/partners/untrust", featureController.updateTrustedby);

// ✅ Job Routes
router.post("/jobs/add", featureController.addjobs);
router.get("/jobs/list", featureController.getjobs);

// ✅ Review Routes
router.post('/reviews', featureController.postReview);
router.get('/reviews', featureController.getReviews);
router.get('/singlereviews', featureController.getReviewsForIndividual);
router.patch('/reviews/:id/approve', featureController.approveReview);
router.put('/reviews/:id', featureController.editReview);
router.delete('/reviews/:id', featureController.deleteReview);

// ✅ Subscription Routes
router.post('/subscribe', featureController.addSubscription);
router.get('/subscribers', featureController.getSubscribers);
router.patch('/unsubscribe', featureController.unsubscribe);
router.get('/check-subscription', featureController.checkSubscription);

// ✅ Resources Routes
router.post('/resources', featureController.addResource);
router.get('/resources', featureController.getAllResources);
router.get('/resources/:id', featureController.getResourceById);
router.get('/resources/category/:category', featureController.getResourcesByCategory);
router.put('/resources/:id', featureController.updateResource);
router.delete('/resources/:id', featureController.deleteResource);

// ✅ Enquiry Routes
router.post('/enquiry', featureController.enquiry);
router.get('/enquiry', featureController.getAllEnquiries);

// ✅ Viewing Request Routes
router.post("/add", featureController.addRequest);
router.post("/clear", featureController.clearRequests);
router.post('/submit-viewing', featureController.submitViewing);
router.post('/clear-db', featureController.clearDb);

// ✅ Tailor Request API Routes
router.post('/requests', featureController.createRequest);
router.get('/requests', featureController.getRequests);
router.get('/requests/:id', featureController.getRequestById);
router.put('/requests/:id', featureController.updateRequest);
router.delete('/requests/:id', featureController.deleteRequest);

// ✅ Featured Listings Routes
router.post("/featured/add", featureController.addFeaturedListing);
router.get("/featured/list", featureController.getFeaturedListings);
router.put("/featured/update", featureController.updateFeaturedListing);
router.delete("/featured/delete/:id", featureController.deleteFeaturedListing);

// ✅ TalkToUs Routes
router.post("/talktous", featureController.createTalkToUs);
router.get("/talktous", featureController.getAllTalkToUs);

// ✅ Feedback Routes
router.post("/feedback", featureController.createFeedback);
router.get("/feedback", featureController.getAllFeedback);


// ✅ Terms and policies Routes
router.post("/terms/add",upload.none(), featureController.createTerms);
router.get("/terms/list/:category",featureController.getTermsByCategory);
router.delete("/terms/list/:id",featureController.deleteTerms);




module.exports = router;
