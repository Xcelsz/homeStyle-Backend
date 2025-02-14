const express = require("express");
const bookingController = require("../controllers/bookingController")

const router = express.Router();

// Routes
router.post('/', bookingController.createBooking); // Create a new booking
router.get('/', bookingController.getAllBookings); // Get all bookings
router.get('/:id', bookingController.getBookingById); // Get booking by ID
router.put('/:id', bookingController.updateBooking); // Update a booking
router.delete('/:id', bookingController.deleteBooking); // Delete a booking





router.post("/bookappointment", bookingController.createAppointment);
router.get("/bookappointment", bookingController.getAppointments);
router.get("/bookappointment/:id", bookingController.getAppointmentById);
router.put("/bookappointment/:id/status", bookingController.updateAppointmentStatus);
router.delete("/bookappointment/:id", bookingController.deleteAppointment);



router.post("/booking-view", bookingController.createBookingView);
router.get("/booking-view", bookingController.getBookingViews);
router.get("/booking-view/:id", bookingController.getBookingViewById);
router.put("/booking-view/:id", bookingController.updateBookingView);
router.delete("/booking-view/:id", bookingController.deleteBookingView);


router.post("/requestquote", bookingController.createRequestQuote);
router.get("/requestquote", bookingController.getRequestQuotes);
router.get("/requestquote/:id", bookingController.getRequestQuoteById);
router.put("/requestquote/:id", bookingController.updateRequestQuote);
router.delete("/requestquote/:id", bookingController.deleteRequestQuote);




router.post("/bookconsult", bookingController.createConsultBooking);
router.get("/bookconsult", bookingController.getConsultBookings);
router.get("/bookconsult/:id", bookingController.getConsultBookingById);
router.put("/bookconsult/:id", bookingController.updateConsultBooking);
router.delete("/bookconsult/:id", bookingController.deleteConsultBooking);



// Decoration Routes
router.post("/bookdeco", bookingController.createDecoBooking);

// Stay Routes
router.post("/bookstay", bookingController.createStayBooking);

// Listings Routes
router.post("/booklistings", bookingController.createListingBooking);


module.exports = router;