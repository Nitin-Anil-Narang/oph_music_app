const db = require("../DB/connect");

// INSERT song record
const insertSong = async (data) => {
  const {
    OPH_ID,
    project_type,
    Song_name,
    release_date,
    payment,
    Lyrics_services
  } = data;

  const [result] = await db.execute(
    `INSERT INTO songs_register 
    (OPH_ID, project_type, Song_name, Video_type, release_date, payment, Lyrics_services)
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      OPH_ID,
      project_type,
      Song_name,
      Video_type,
      release_date,
      payment,
      Lyrics_services
    ]
  );

  return result;
};

module.exports = { insertSong };
