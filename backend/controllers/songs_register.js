const { insertSong } = require("../model/songs_register");

const insertSongController = async (req, res) => {
  try {
    const {
      OPH_ID,
      project_type,
      Song_name,
      release_date,
      payment,
      Lyrics_services
    } = req.body;

    let { Video_type } = req.body;
    if (Array.isArray(Video_type)) {
      Video_type = Video_type.join(", "); // e.g., "music video, lyrics video"
    }

    const songData = {
      OPH_ID,
      project_type,
      Song_name,
      release_date,
      payment,
      Video_type,
      Lyrics_services: Lyrics_services ? 1 : 0
    };

    const result = await insertSong(songData);
    res.status(201).json({ message: "Song registered successfully", result });
  } catch (error) {
    console.error("Insert song error:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { insertSongController };
