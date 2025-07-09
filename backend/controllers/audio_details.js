const { insertSongDetails } = require("../model/audio_details");
const { uploadToS3 } = require("../utils");
const bucket = require("../utils.js");

const insertSongDetailsController = async (req, res) => {
  try {
    const {
      OPH_ID,
      song_id,
      Song_name,
      language,
      genre,
      sub_genre,
      mood,
      lyrics,
      primary_artist,
    } = req.body;

    const audio_file = req.file

    let audioPath = ''

    if (audio_file) {
      const fileURL = await bucket.uploadToS3(
        audio_file,
        `audio-meta/${OPH_ID}/audio-url`
      )
      if (fileURL) {
        audioPath = fileURL
      }
    }

    console.log(audioPath);

    const result = await insertSongDetails(
      OPH_ID,
      song_id,
      Song_name,
      language,
      genre,
      sub_genre,
      mood,
      lyrics,
      primary_artist,
      audioPath
    );

    if (result) {
      res.status(201).json({ message: "Song details saved", result });
    }

  } catch (error) {
    console.error("Insert song detail error:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { insertSongDetailsController };
