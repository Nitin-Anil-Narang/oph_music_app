// model/secondary_artist.js
const db = require("../DB/connect");

/**
 * Insert a new secondary artist row
 */
const insertSecondaryArtist = async (
  OPH_ID,
  artist_type,
  artist_name,
  Legal_name,
  SpotifyLink,
  InstagramLink,
  FacebookLink,
  AppleMusicLink,
  artistPictureUrl
) => {
  const [result] = await db.execute(
    `INSERT INTO secondary_artist (
  OPH_ID,
  artist_type,
  artist_name,
  Legal_name,
  SpotifyLink,
  InstagramLink,
  FacebookLink,
  AppleMusicLink,
  artistPictureUrl
     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      OPH_ID,
      artist_type,
      artist_name,
      Legal_name,
      SpotifyLink,
      InstagramLink,
      FacebookLink,
      AppleMusicLink,
      artistPictureUrl
    ]
  );

  return result;
};

/**
 * Update an existing secondary artist (keyed by OPH_ID + artist_type)
 */
const updateSecondaryArtist = async (
  OPH_ID,
  artist_type,
  artist_name,
  Legal_name,
  SpotifyLink,
  InstagramLink,
  FacebookLink,
  AppleMusicLink,
  artistPictureUrl
) => {
  const [result] = await db.execute(
    `UPDATE secondary_artist
        SET artist_name      = ?,
        Legal_name       = ?,
        artistPictureUrl = ?,
        SpotifyLink      = ?,
        InstagramLink     = ?,
        FacebookLink     = ?,
        AppleMusicLink  = ?
        WHERE OPH_ID      = ?
        AND artist_type = ?`,
    [
      OPH_ID,
      artist_type,
      artist_name,
      Legal_name,
      SpotifyLink,
      InstagramLink,
      FacebookLink,
      AppleMusicLink,
      artistPictureUrl
    ]
  );

  return result;
};

/**
 * Fetch a single secondary artist row by OPH_ID + artist_type
 */
const getByOphIdAndType = async (OPH_ID, artist_type) => {
  const [rows] = await db.execute(
    `SELECT *
       FROM secondary_artist
      WHERE OPH_ID      = ?
        AND artist_type = ?`,
    [OPH_ID, artist_type]
  );

  return rows;
};

/**
 * List all secondary artists for one OPH_ID
 */
const getSecondaryArtistsByOphId = async (OPH_ID) => {
  const [rows] = await db.execute(
    `SELECT *
       FROM secondary_artist
      WHERE OPH_ID = ?`,
    [OPH_ID]
  );

  return rows;
};

module.exports = {
  insertSecondaryArtist,
  updateSecondaryArtist,
  getByOphIdAndType,
  getSecondaryArtistsByOphId,
};
