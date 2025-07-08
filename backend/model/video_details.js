// model/video_details.js
const db = require("../DB/connect");

/**
 * Insert a new video‑details row
 */
const insertVideoDetails = async (
  OPH_ID,
  Song_name,
  credits,
  image_url,
  video_url
) => {
  const [result] = await db.execute(
    `INSERT INTO video_details (
       OPH_ID,
       Song_name,
       credits,
       image_url,
       video_url
     ) VALUES (?, ?, ?, ?, ?)`,
    [
      OPH_ID,
      Song_name,
      credits,
      image_url,
      video_url
    ]
  );

  return result; // mysql2 ResultSetHeader
};

/**
 * Fetch a single video‑details row by composite key (OPH_ID + Song_name)
 */
const getVideoDetails = async (OPH_ID, Song_name) => {
  const [rows] = await db.execute(
    `SELECT *
       FROM video_details
      WHERE OPH_ID   = ?
        AND Song_name = ?`,
    [OPH_ID, Song_name]
  );

  return rows; // array; 0 or 1 row expected
};

module.exports = {
  insertVideoDetails,
  getVideoDetails,
};
