const professional = require("../model/professional_details");
const { uploadToS3 } = require("../utils");
const user_details = require("../model/professional_details.js");
const { setCurrentStep } = require("../model/common/set_step.js");

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
      ExperienceYearly = 0,
      ExperienceMonthly,
      SongsPlanningCount,
      SongsPlanningType,
      step,
      VideoURL,
      photoURLs = [],
    } = req.body;

    console.log(photoURLs, "from Frontend");
    console.log(OPH_ID);

    const user = await user_details.getProfessionalByOphId (OPH_ID);

    if (user.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    console.log(user[0].PhotoURLs, "from Backend");

    let backendPhotoURLs = user[0].PhotoURLs;

    const videoFile = req.files?.video?.[0];
    const photoFiles = req.files?.photos || [];
    console.log(photoFiles);
    

    function compareUrls(jsonString, urlArray) {
      let parsedArray;

      try {
        parsedArray = JSON.parse(jsonString);
      } catch (e) {
        console.error("Invalid JSON string");
        return false;
      }

      if (!Array.isArray(parsedArray) || !Array.isArray(urlArray)) {
        return false;
      }

      if (parsedArray.length !== urlArray.length) {
        return false;
      }

      for (let i = 0; i < parsedArray.length; i++) {
        if (parsedArray[i] !== urlArray[i]) {
          return false;
        }
      }

      if(photoFiles.length > 0){
        return false;
      }

      return true;
    }

    // Check if photo URLs are unchanged
    const isPhotoUrlsSame = compareUrls(backendPhotoURLs, photoURLs);
    console.log("Are photo URLs unchanged?", isPhotoUrlsSame);

    // Compare other fields one by one
    const isProfessionSame = user[0].Profession === Profession;
    const isBioSame = user[0].Bio === Bio;
    const isSpotifyLinkSame = user[0].SpotifyLink === SpotifyLink;
    const isInstagramLinkSame = user[0].InstagramLink === InstagramLink;
    const isFacebookLinkSame = user[0].FacebookLink === FacebookLink;
    const isAppleMusicLinkSame = user[0].AppleMusicLink === AppleMusicLink;
    const isExperienceYearlySame =
      parseInt(user[0].ExperienceYearly) === parseInt(ExperienceYearly);
    const isExperienceMonthlySame =
      parseInt(user[0].ExperienceMonthly) === parseInt(ExperienceMonthly);
    const isSongsPlanningCountSame =
      parseInt(user[0].SongsPlanningCount) === parseInt(SongsPlanningCount);
    const isSongsPlanningTypeSame =
      user[0].SongsPlanningType === SongsPlanningType;
    const isVideoSame = user[0].VideoURL === VideoURL;

    // Check if ALL are same
    const isAllFieldsSame =
      isProfessionSame &&
      isBioSame &&
      isSpotifyLinkSame &&
      isInstagramLinkSame &&
      isFacebookLinkSame &&
      isAppleMusicLinkSame &&
      isExperienceYearlySame &&
      isExperienceMonthlySame &&
      isSongsPlanningCountSame &&
      isSongsPlanningTypeSame &&
      isVideoSame &&
      isPhotoUrlsSame;

    console.log("Are all fields same including photos?", isAllFieldsSame);

    if (isAllFieldsSame) {
      await setCurrentStep(step, OPH_ID);
      return res.status(200).json({
        success: true,
        message: "All data unchanged. Step updated successfully.",
        step: step,
      });
    } else {
      // Log changed fields with old and new values
      const changedFields = [];

      if (!isProfessionSame) {
        changedFields.push({
          field: "Profession",
          old: user[0].Profession,
          new: Profession,
        });
      }
      if (!isBioSame) {
        changedFields.push({ field: "Bio", old: user[0].Bio, new: Bio });
      }
      if (!isSpotifyLinkSame) {
        changedFields.push({
          field: "SpotifyLink",
          old: user[0].SpotifyLink,
          new: SpotifyLink,
        });
      }
      if (!isInstagramLinkSame) {
        changedFields.push({
          field: "InstagramLink",
          old: user[0].InstagramLink,
          new: InstagramLink,
        });
      }
      if (!isFacebookLinkSame) {
        changedFields.push({
          field: "FacebookLink",
          old: user[0].FacebookLink,
          new: FacebookLink,
        });
      }
      if (!isAppleMusicLinkSame) {
        changedFields.push({
          field: "AppleMusicLink",
          old: user[0].AppleMusicLink,
          new: AppleMusicLink,
        });
      }
      if (!isExperienceYearlySame) {
        changedFields.push({
          field: "ExperienceYearly",
          old: user[0].ExperienceYearly,
          new: ExperienceYearly,
        });
      }
      if (!isExperienceMonthlySame) {
        changedFields.push({
          field: "ExperienceMonthly",
          old: user[0].ExperienceMonthly,
          new: ExperienceMonthly,
        });
      }
      if (!isSongsPlanningCountSame) {
        changedFields.push({
          field: "SongsPlanningCount",
          old: user[0].SongsPlanningCount,
          new: SongsPlanningCount,
        });
      }
      if (!isSongsPlanningTypeSame) {
        changedFields.push({
          field: "SongsPlanningType",
          old: user[0].SongsPlanningType,
          new: SongsPlanningType,
        });
      }
      if (!isVideoSame) {
        changedFields.push({
          field: "VideoURL",
          old: user[0].VideoURL,
          new: VideoURL,
        });
      }
      if (!isPhotoUrlsSame) {
        changedFields.push({
          field: "PhotoURLs",
          old: user[0].PhotoURLs,
          new: JSON.stringify(photoURLs),
        });
      }

      console.log("Changed fields with old and new values:", changedFields);
    }

    

    let videoFinalURL = null;
    let allPhotoURLs = [];

    // Video logic
    if (videoFile) {
      videoFinalURL = await uploadToS3(videoFile, `allUsers/${OPH_ID}/videos`);
    } else if (VideoURL) {
      videoFinalURL = VideoURL;
    }

    // Photos logic
    if (photoFiles.length > 0) {
      for (const file of photoFiles) {
        const url = await uploadToS3(file, `allUsers/${OPH_ID}/images`);
        allPhotoURLs.push(url);
      }
    }

    if (photoURLs && Array.isArray(photoURLs)) {
      allPhotoURLs.push(...photoURLs); // append old URLs
    }

    const dbResponse = await professional.insertProfessionalDetails(
      OPH_ID,
      Profession,
      Bio,
      videoFinalURL,
      JSON.stringify(allPhotoURLs),
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
      await setCurrentStep(step, OPH_ID);
      return res.status(200).json({
        success: true,
        message: "Professional details inserted successfully",
        step: step,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to insert professional details",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

const getProfessionalByOphId = async (req, res) => {
  try {
    const { ophid } = req.query;
    const data = await user_details.getProfessionalDetails(ophid);
    console.log(data);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Data not found for the given OPH_ID",
      });
    }

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  insertProfessionalDetails,
  getProfessionalByOphId,
};
