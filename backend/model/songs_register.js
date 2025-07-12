const db = require("../DB/connect");


const getSongID = async (name) => {

  const [rows] = await db.execute("SELECT song_id FROM songs_register WHERE Song_name = ?", [name])
  
  return rows
}


// INSERT song record
const insertNewSong = async (OPH_ID,
  project_type,
  Song_name,
  release_date,
  payment,
  Lyrics_services,
  next_step) => {

  const [result] = await db.execute(
    `INSERT INTO songs_register 
    (OPH_ID, project_type, Song_name,release_date, payment, Lyrics_services, current_page, song_register_journey)
    VALUES (?, ?, ?, ?, ?, ?,?,?)`,
    [
      OPH_ID,
      project_type,
      Song_name,
      release_date,
      payment,
      Lyrics_services,
      next_step,
      'incomplete'
    ]
  );

  return result;
};

const insertHybridSong = async (OPH_ID,
  project_type,
  Song_name,
  release_date,
  payment,
  Lyrics_services,
  available_on_music_platforms
  ) => {

  const [result] = await db.execute(
    `INSERT INTO songs_register 
    (OPH_ID, project_type, Song_name,release_date, payment, Lyrics_services,availability_on_music_platform)
    VALUES (?, ?, ?, ?, ?, ?,?)`,
    [
      OPH_ID,
      project_type,
      Song_name,
      release_date,
      payment,
      Lyrics_services,
      available_on_music_platforms
    ]
  );

  return result;
};


const getSongRegDetailsByOPHID = async (ophid) => {

  const [rows] = await db.execute("SELECT Song_name, song_id, current_page FROM songs_register WHERE OPH_ID = ? AND song_register_journey = 'incomplete' ORDER BY song_id LIMIT 1",[ophid])
  return rows

}


module.exports = { insertNewSong,insertHybridSong, getSongID, getSongRegDetailsByOPHID };
