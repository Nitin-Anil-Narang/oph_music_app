const professional = require("../model/professional_details");
const { uploadToS3 } = require("../utils");

const insertProfessionalDetails = async (req, res) => {
  try {
    const {
      OPH_ID,
      Profession,
      Bio,
      SpotifyLink,
      InstagramLink,
      FacebookLink,
      AppleMusicLink,
      ExperienceYearly,
      ExperienceMonthly,
      SongsPlanningCount,
      SongsPlanningType
    } = req.body;

    const videoFile = req.files?.video?.[0];
    const photoFiles = req.files?.photos || [];

    let videoURL = null;
    let photoURLs = [];

    if (videoFile) {
      videoURL = await uploadToS3(videoFile, "videos");
    }

    if (photoFiles.length > 0) {
      for (const file of photoFiles) {
        const url = await uploadToS3(file, "images");
        photoURLs.push(url);
      }
    }

    const dbResponse = await professional.insertProfessionalDetails(
      OPH_ID,
      Profession,
      Bio,
      videoURL,
      JSON.stringify(photoURLs),
      SpotifyLink,
      InstagramLink,
      FacebookLink,
      AppleMusicLink,
      parseInt(ExperienceYearly),
      parseInt(ExperienceMonthly),
      parseInt(SongsPlanningCount),
      SongsPlanningType
    );

    if (dbResponse) {
      return res.status(200).json({
        success: true,
        message: "Professional details inserted successfully",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to insert professional details",
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};



const getProfessionalDetailsByOphId = async (req, res) => {
  try {
    const { ophid } = req.params;
    
    const result = await professional.getProfessionalByOphId(ophid);

    if (result.length > 0) {
      return res.status(200).json({ success: true, data: result[0] });
    }

    return res.status(404).json({ success: false, message: error });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  insertProfessionalDetails,
  getProfessionalDetailsByOphId
};