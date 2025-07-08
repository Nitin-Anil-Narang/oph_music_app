const db = require('../../DB/connect');


const findUserByEmail = async (email) => {
  const [rows] = await db.execute('SELECT * FROM admin WHERE Email = ?', [email]);
  return rows;
};

const updateRoleByEmail = async (email, newRole) => {
  const [result] = await db.execute('UPDATE admin SET Role = ? WHERE Email = ?', [newRole, email]);
  return result;
};



module.exports = { findUserByEmail,updateRoleByEmail };
