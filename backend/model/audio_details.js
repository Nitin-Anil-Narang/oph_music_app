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
  console.log(OPH_ID,
    Song_name,
    language,
    genre,
    sub_genre,
    mood,
    lyrics,
    primary_artist,
    audioPath);
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

module.exports = { insertSongDetails };
