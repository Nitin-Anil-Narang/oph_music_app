const user_details = require("../model/personal_details.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const bucket = require("../utils.js");
const { setCurrentStep } = require("../model/common/set_step.js");

const insertPersonalDetails = async (req, res) => {
  try {
    let storageLocation = "";

    // Access fields from req.body and req.file
    const {
      ophid,
      legal_name,
      stage_name,
      contact_num,
      location,
      email,
      step,
    } = req.body;
    const profile_image = req.file; // multer stores file here

    if (
      !ophid ||
      !legal_name ||
      !stage_name ||
      !profile_image ||
      !contact_num ||
      !location ||
      !email
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const user = await user_details.getPersonalDetails(ophid);

    if (user.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const storeImgIntoBucket = await bucket.uploadToS3(
      profile_image,
      "profile_image"
    );

    if (storeImgIntoBucket) {
      storageLocation = storeImgIntoBucket;
    }

    const updatedData = await user_details.setPersonalDetails(
      ophid,
      legal_name,
      stage_name,
      contact_num,
      storageLocation,
      location,
      email
    );

    if (updatedData && updatedData.affectedRows > 0) {
      await setCurrentStep(step, ophid);
      return res
        .status(201)
        .json({
          success: true,
          message: "Data updated successfully",
          step: step,
        });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Failed to update data" });
    }
  } catch (err) {
    console.error("Error updating personal details:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const mapPersonalDetails = async (req, res) => {
  try {
    const { ophid } = req.query;

    if (!ophid) {
      return res.status(400).json({
        success: false,
        message: "Missing 'ophid' in request query",
      });
    }

    const user = await user_details.getPersonalDetails(ophid);
    const userDetails = user[0];

    if (user.length > 0) {
      return res.status(200).json({
        success: true,
        message: "Successfully fetched data",
        data: {
          full_name: userDetails.full_name,
          stage_name: userDetails.stage_name,
          contact_num: userDetails.contact_num,
          email: userDetails.email,
          profile_pic : userDetails.personal_photo,
          location: userDetails.location
        },
      });
    }

    return res.status(404).json({
      success: false,
      message: "User not found with provided ophid",
    });
  } catch (err) {
    console.error("Error fetching personal details:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { mapPersonalDetails, insertPersonalDetails };
