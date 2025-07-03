const db = require('../../DB/connect');


const findUserByEmail = async (email) => {
  const [rows] = await db.execute('SELECT * FROM admin WHERE Email = ?', [email]);
  return rows;
};




module.exports = { findUserByEmail };
