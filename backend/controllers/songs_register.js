const db = require("../DB/connect"); // adjust if you're using a model
const { uploadToS3 } = require("../utils");

// POST /video-details
const insertVideoDetails = async (req, res) => {
  try {
    const { OPH_ID, Song_name, credits, image_url } = req.body;

    if (!OPH_ID || !Song_name || !credits || !image_url) {
      return res.status(400).json({
        success: false,
        message: "OPH_ID, Song_name, and credits are required",
      });
    }

    // Check if song exists in song_register
    const [songs] = await db.execute(
      `SELECT id FROM song_register WHERE OPH_ID = ? AND Song_name = ?`,
      [OPH_ID, Song_name]
    );

    if (songs.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No matching song found with the given OPH_ID and Song_name",
      });
    }

    const songId = songs[0].id;

    // Upload image if provided
    // let imageUrl = null;
    // const imageFile = req.files?.image?.[0];
    // if (imageFile) {
    //   imageUrl = await uploadToS3(imageFile, "images");
    // }

    // Insert into video_details
    const [result] = await db.execute(
      `INSERT INTO video_details (song_id, credits, image_url) VALUES (?, ?, ?)`,
      [songId, credits, image_url]
    );

    res.status(200).json({
      success: true,
      message: "Video details inserted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  insertVideoDetails,
};
