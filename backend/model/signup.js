const db = require('../DB/connect'); // MySQL connection

const createUser = async (ophid, name, stageName, email, contactNumber, password, artistType) => {
  const [result] = await db.execute(
    'INSERT INTO user_details (ophid, full_name, stage_name, email, contact_num, user_pass, artist_type) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [ophid, name, stageName, email, contactNumber, password, artistType]
  );
  return result;
};

const getEmailAndNumber = async (email, contactNumber) => {
  const [rows] = await db.execute(
    'SELECT * FROM user_details WHERE email = ? OR contact_num = ?',
    [email, contactNumber]
  );
  return rows;
};

const storeArtistType = async (artistType) => {
  const [rows] = await db.execute(
    'SELECT artist_type, COUNT(artist_type) AS cnt FROM user_details WHERE artist_type = ? GROUP BY artist_type',
    [artistType]
  );
  return rows;
};


module.exports = {
  createUser,
  getEmailAndNumber,
  storeArtistType
};