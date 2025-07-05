const db = require('../DB/connect');

const insertBooking = async (oph_id, booking_date) => {
  const [result] = await db.execute(
    `INSERT INTO calender (oph_id, current_booking_date, previous_booking_date, original_booking_date)
     VALUES (?, ?, ?, ?)`,
    [oph_id, booking_date, null, booking_date]
  );
  return result;
};

const findBookingByDate = async (booking_date) => {
  const [rows] = await db.execute(
    'SELECT * FROM calender WHERE current_booking_date = ?',
    [booking_date]
  );
  return rows;
};

const findBookingByOphIdAndDate = async (oph_id, booking_date) => {
  const [rows] = await db.execute(
    'SELECT * FROM calender WHERE oph_id = ? AND current_booking_date = ?',
    [oph_id, booking_date]
  );
  return rows;
};

const updateBooking = async (oph_id, old_booking_date, new_booking_date) => {
  const [result] = await db.execute(
    `UPDATE calender
     SET previous_booking_date = ?, current_booking_date = ?
     WHERE oph_id = ? AND current_booking_date = ?`,
    [old_booking_date, new_booking_date, oph_id, old_booking_date]
  );
  return result;
};

const getAllBookings = async () => {
  const [rows] = await db.execute('SELECT * FROM calender');

  
  return rows;
};

module.exports = {
  insertBooking,
  findBookingByDate,
  findBookingByOphIdAndDate,
  updateBooking,
  getAllBookings,
};
