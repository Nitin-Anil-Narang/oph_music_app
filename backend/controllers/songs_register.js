const songRegModel = require("../model/songs_register");

exports.insertSongRegDetails = async (req, res) => {
  try {
    const { oph_id, project_type, name, release_date, lyricalVid } = req.body;

    if ((!oph_id, !project_type, !name, !release_date, !lyricalVid)) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const RegSongRes = await songRegModel.insertSong(
      oph_id,
      project_type,
      name,
      release_date,
      lyricalVid === false ? "base" : "base + lyrics",
      parseInt(lyricalVid)
    );

    if (RegSongRes) {
      return res.status(201).json({
        success: true,
        message: "Song Registered Successfully",
      });
    }
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
