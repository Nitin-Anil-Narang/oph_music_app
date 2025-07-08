const { insertSongDetails } = require("../model/audio_details");
const { uploadToS3 } = require("../utils"); 

const insertSongDetailsController = async (req, res) => {
  try {
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
    } = req.body;

 
  
    const result = await insertSongDetails({
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
    });

    res.status(201).json({ message: "Song details saved", result });
  } catch (error) {
    console.error("Insert song detail error:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { insertSongDetailsController };
