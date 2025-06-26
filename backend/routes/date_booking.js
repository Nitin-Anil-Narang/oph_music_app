const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/date_booking');
const authMiddleware = require("../middleware/authenticate")

router.post('/booking', authMiddleware, bookingController.createOrUpdateBooking);
router.get('/bookings', authMiddleware, bookingController.getAllBookings);

module.exports = router;