const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/date_booking');
const test = require('../controllers/test');

router.post('/booking', bookingController.createOrUpdateBooking);
router.get('/bookings', test.getAllBookings);

module.exports = router;