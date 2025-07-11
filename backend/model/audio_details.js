const db = require("../DB/connect");

const insertSongDetails = async (
  OPH_ID,
  song_id,
  Song_name,
  language,
  genre,
  sub_genre,
  mood,
  lyrics,
  primary_artist,
  audioPath) => {
  
  const [result] = await db.execute(
    `INSERT INTO audio_details (
      OPH_ID, Song_name, language, genre, sub_genre, mood,
      lyrics, primary_artist, audio_url, song_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?,?)`,
    [
      OPH_ID,
      Song_name,
      language,
      genre,
      sub_genre,
      mood,
      lyrics,
      primary_artist,
      audioPath,
      song_id
    ]
  );

  return result;
};


const setNextPage = async (next_step, ophid, song_id) => {

  const [rows] = await db.execute("UPDATE songs_register SET current_page = ? WHERE OPH_ID = ? AND song_id = ?", [next_step, ophid,song_id])

  return rows

}

const getAudioMeta = async (song_id, ophid) =>
{
  const [rows] = await db.execute(
    "SELECT * FROM audio_details WHERE song_id = ? AND OPH_ID = ?", [song_id, ophid]
  )

  return rows
} 

const getSecondaryArtist = async (song_id) => {

  const [rows] = await db.execute(
    "SELECT * FROM secondary_artist WHERE song_id = ?", [song_id]
  )

  return rows

}

module.exports = { insertSongDetails,getAudioMeta,getSecondaryArtist, setNextPage };
