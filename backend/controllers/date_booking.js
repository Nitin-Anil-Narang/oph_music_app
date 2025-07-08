const bookingModel = require('../model/date_booking');

exports.createOrUpdateBooking = async (req, res) => {
  const { oph_id, booking_date} = req.body;
  
  console.log(oph_id, booking_date);
  

  if (!oph_id) {
    return res.status(400).json({ success: false, error: 'oph_id is required' });
  }

  try {

   
  } catch (error) {
    res.status(500).json({ success: false ,error: error.message });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await bookingModel.getAllBookings();
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ success: false ,error: error.message });
  }
};
