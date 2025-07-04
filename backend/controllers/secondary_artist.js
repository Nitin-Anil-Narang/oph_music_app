// controllers/secondaryArtistController.js
const secondaryArtist = require("../model/secondary_artist.js"); // ⬅︎ create this model next
const user_details    = require("../model/professional_details.js");
const { uploadToS3 }  = require("../utils");

// -----------------------------------------------------------------------------
// POST /secondary-artists           ➜ create a new secondary artist row
// -----------------------------------------------------------------------------


const insertSecondaryArtist = async (req, res) => {
  try {
    const {
      OPH_ID,
      artist_type,
      artist_name,
      Legal_name,
      artistPictureUrl,
      SpotifyLink,
      InstagramLink,
      FacebookLink,
      AppleMusicLink
    } = req.body;

    /* 1 ▸ make sure the parent OPH user exists (same guard you already use) */
    const user = await user_details.getProfessionalDetails(OPH_ID);
    if (user.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
      }
      
    /* 2 ▸ optional picture upload */
    const pictureFile     = req.files?.artistPicture?.[0];
    // const artistPictureUrl = pictureFile
    //   ? await uploadToS3(pictureFile, "images")
    //   : null;

    /* 3 ▸ write to DB */
    const dbResponse = await secondaryArtist.insertSecondaryArtist(
      OPH_ID,
      artist_type,
      artist_name,
      Legal_name,
      artistPictureUrl,
      SpotifyLink,
      InstagramLink,
      FacebookLink,
      AppleMusicLink
    );

    if (dbResponse) {
      return res
        .status(200)
        .json({ success: true, message: "Secondary artist inserted successfully" });
    }

    return res
      .status(500)
      .json({ success: false, message: "Failed to insert secondary artist" });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};

// -----------------------------------------------------------------------------
// PUT /secondary-artists            ➜ update an existing secondary artist row
// -----------------------------------------------------------------------------
const updateSecondaryArtist = async (req, res) => {
  try {
    const {
      OPH_ID,
      artist_type,
      artist_name,
      Legal_name,
      artistPictureUrl,
      SpotifyLink,
      InstagramLink,
      FacebookLink,
      AppleMusicLink,
    } = req.body;

    if (!OPH_ID || !artist_type) {
      return res
        .status(400)
        .json({ success: false, message: "OPH_ID and artist_type are required" });
    }

    /* grab the existing row so we can keep the old picture URL if no file sent */
    const existing = await secondaryArtist.getByOphIdAndType(OPH_ID, artist_type);
    if (existing.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Secondary artist not found" });
    }

    //const pictureFile      = req.files?.artistPicture?.[0];
    // const artistPictureUrl = pictureFile
    //   ? await uploadToS3(pictureFile, "images")
    //   : existing[0].artist_picture_url;

    const dbResponse = await secondaryArtist.updateSecondaryArtist(
      OPH_ID,
      artist_type,
      artist_name,
      Legal_name,
      artistPictureUrl,
      SpotifyLink,
      InstagramLink,
      FacebookLink,
      AppleMusicLink
    );

    if (dbResponse) {
      return res
        .status(200)
        .json({ success: true, message: "Secondary artist updated successfully" });
    }

    return res
      .status(500)
      .json({ success: false, message: "Failed to update secondary artist" });
  } catch (err) {
    console.error(err);
    console.log(res);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};

// -----------------------------------------------------------------------------
// GET /secondary-artists?ophid=123  ➜ list all secondary artists for an OPH_ID
// -----------------------------------------------------------------------------
const getSecondaryArtistsByOphId = async (req, res) => {
  try {
    const { OPH_ID } = req.query;
    const data = await secondaryArtist.getSecondaryArtistsByOphId(OPH_ID);

    if (!data || data.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Data not found for the given OPH_ID" });
    }

    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: error.message });
      
  }
};

// const user = await secondaryArtist.getSecondaryArtistsByOphId(OPH_ID);
// if (user.length === 0) {
//   return res.status(404).json({
//     success: false,
//     message: "User not found",
//   });
// }



module.exports = {
  insertSecondaryArtist,
  updateSecondaryArtist,
  getSecondaryArtistsByOphId,
};
