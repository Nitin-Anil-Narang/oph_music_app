const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/date_booking');
const authMiddleware = require("../middleware/authenticate")

router.post('/booking', authMiddleware, bookingController.createBooking);
router.post('/change-release-date', authMiddleware, bookingController.updateBooking);
router.get('/bookings',  authMiddleware,bookingController.getAllBookings);
router.get('/bookings-by-id', authMiddleware, bookingController.getAllBookingsByID);

module.exports = router;