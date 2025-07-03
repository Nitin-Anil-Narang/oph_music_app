const db = require("../DB/connect");

const insertSongDetails = async (data) => {
  const {
    OPH_ID,
    Song_name,
    language,
    genre,
    sub_genre,
    mood,
    lyrics,
    primary_artist,
    featuring,
    lyricist,
    composer,
    producer,
    audio_url
  } = data;

  const [result] = await db.execute(
    `INSERT INTO audio_details (
      OPH_ID, Song_name, language, genre, sub_genre, mood,
      lyrics, primary_artist, featuring, lyricist,
      composer, producer, audio_url
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      OPH_ID,
      Song_name,
      language,
      genre,
      sub_genre,
      mood,
      lyrics,
      primary_artist,
      featuring,
      lyricist,
      composer,
      producer,
      audio_url
    ]
  );

  return result;
};

module.exports = { insertSongDetails };
