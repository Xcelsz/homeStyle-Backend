const express = require("express");
const bookingController = require("../controllers/bookingController")

const router = express.Router();

// Routes
router.post('/', bookingController.createBooking); // Create a new booking
router.get('/', bookingController.getAllBookings); // Get all bookings
router.get('/:id', bookingController.getBookingById); // Get booking by ID
router.put('/:id', bookingController.updateBooking); // Update a booking
router.delete('/:id', bookingController.deleteBooking); // Delete a booking


module.exports = router;