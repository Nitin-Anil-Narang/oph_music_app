const db = require('../DB/connect');


const findUserByEmail = async (email) => {
  const [rows] = await db.execute('SELECT * FROM user_details WHERE email = ?', [email]);
  return rows;
};

module.exports = { findUserByEmail };
