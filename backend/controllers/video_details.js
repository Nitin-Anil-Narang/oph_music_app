const videoDetails = require("../model/video_details");
// const { uploadToS3 } = require("../utils");

exports.createVideoDetails = async (req, res) => {
  try {
    const { OPH_ID, Song_name, credits } = req.body;

    const image_url = req.file;
    const video_url = req.file;
    // 3️⃣  Insert into the child table
    await videoDetails.insertVideoDetails(
      OPH_ID,
      Song_name,
      credits,
      image_url,
      video_url
    );

    res.status(200).json({ success: true, message: "Video details saved" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};
