const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/date_booking');

router.post('/booking', bookingController.createOrUpdateBooking);
router.get('/bookings', bookingController.getAllBookings);

module.exports = router;