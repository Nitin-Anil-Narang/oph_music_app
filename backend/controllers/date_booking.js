const bookingModel = require('../model/date_booking');

exports.createOrUpdateBooking = async (req, res) => {
  const { oph_id, booking_date, old_booking_date, new_booking_date } = req.body;

  if (!oph_id) {
    return res.status(400).json({ error: 'oph_id is required' });
  }

  try {
    // Case 1: New booking → only oph_id & booking_date given
    if (booking_date && !old_booking_date && !new_booking_date) {
      const existing = await bookingModel.findBookingByDate(booking_date);
      if (existing.length > 0) {
        return res.status(400).json({ error: 'This date is already booked by someone' });
      }

      await bookingModel.insertBooking(oph_id, booking_date);
      return res.status(201).json({ message: 'Booking created', oph_id, booking_date });
    }

    // Case 2: Update → requires old_booking_date and new_booking_date
    if (old_booking_date && new_booking_date) {
      // 1. Check if booking with oph_id and old_booking_date exists
      const booking = await bookingModel.findBookingByOphIdAndDate(oph_id, old_booking_date);
      if (booking.length === 0) {
        return res.status(404).json({ error: 'Booking with the provided oph_id and old_booking_date not found' });
      }

      if (old_booking_date === new_booking_date) {
        return res.status(400).json({ error: 'New booking date is same as old booking date' });
      }

      // 2. Check if new date is already booked by anyone
      const dateTaken = await bookingModel.findBookingByDate(new_booking_date);
      if (dateTaken.length > 0) {
        return res.status(400).json({ error: 'New booking date is already taken by another booking' });
      }

      // 3. Update booking
      await bookingModel.updateBooking(oph_id, old_booking_date, new_booking_date);

      return res.status(200).json({ message: 'Booking updated', oph_id, new_booking_date });
    }

    return res.status(400).json({ error: 'Invalid request. Provide either booking_date or both old_booking_date & new_booking_date.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await bookingModel.getAllBookings();
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
