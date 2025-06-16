const db = require('../DB/connect'); // MySQL connection

const createUser = async (name,stageName, email, contactNumber, password, artistType) => {
  const [result] = await db.execute(
    'INSERT INTO user_details (full_name, stage_name, email, contact_num,user_pass, artist_type) VALUES (?, ?, ?,?, ?, ?)',
    [name,stageName, email, contactNumber, password, artistType]
  );
  return result;
};

const getEmailAndNumber = async (email,contactNumber) => {
  const [rows] = await db.execute('SELECT * FROM user_details WHERE email = ? OR contact_num = ?', [email, contactNumber]);
  return rows;
};

module.exports = {createUser, getEmailAndNumber}