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
  Lyrics_services) => {

  const [result] = await db.execute(
    `INSERT INTO songs_register 
    (OPH_ID, project_type, Song_name,release_date, payment, Lyrics_services)
    VALUES (?, ?, ?, ?, ?, ?)`,
    [
      OPH_ID,
      project_type,
      Song_name,
      release_date,
      payment,
      Lyrics_services
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


module.exports = { insertNewSong,insertHybridSong, getSongID };
