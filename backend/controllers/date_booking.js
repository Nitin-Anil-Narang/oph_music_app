const bookingModel = require('../model/date_booking');

exports.createBooking = async (req, res) => {


  try {

    const { oph_id, booking_date } = req.body;

    if (!oph_id) {
      return res.status(400).json({ error: 'oph_id is required' });
    }
    console.log("ashdjsagdasgdhgashdsad");


    const response = await bookingModel.insertBooking(oph_id, booking_date)

    if (response) {
      return res.status(201).json({
        success: true,
        message: "Release date has been booked successfully"
      })
    }

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.updateBooking = async (req, res) => {

  try {
    const { oph_id, old_booking_date, new_booking_date } = req.body;

    if (!oph_id) {

      return res.status(400).json({ error: 'oph_id is required' })
    }

    const getExistingBookingDate = await bookingModel.findBookingByOphIdAndDate(oph_id, old_booking_date)

    if (getExistingBookingDate) {
      const updatedExistingBookingDate = await bookingModel.updateBooking(oph_id, old_booking_date, new_booking_date)

      if (updatedExistingBookingDate) {
        return res.status(201).json({
          success: true,
          message: "Date Updated successfully"
        })
      }
    }

  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }

}

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await bookingModel.getAllBookings();
    res.status(200).json({
      success: true,
      message: "Data fetched successfully",
      data: bookings
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllBookingsByID = async (req, res) => {
  try {

    const { ophid } = req.query;
    console.log(ophid);

    const bookings = await bookingModel.getAllBookingsByID(ophid);

    if (bookings) {

      res.status(200).json({
        success: true,
        message: "Data fetched successfully",
        data: bookings
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
