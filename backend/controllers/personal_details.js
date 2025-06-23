const user_details = require("../model/personal_details.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const bucket = require("../utils/utils.js");

const insertPersonalDetails = async (req, res) => {
  try {
    let storageLocation = "";
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.SECRET_KEY);
    } catch (err) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid or expired token" });
    }

    // Access fields from req.body and req.file
    const { ophid, legal_name, stage_name, contact_num, location,email } = req.body;
    const profile_image = req.file; // multer stores file here

    console.log(req.file);
    

    if (!ophid || !legal_name || !stage_name || !profile_image || !contact_num || !location || !email) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const storeImgIntoBucket = await bucket.uploadToS3(
      profile_image,
      "profile_image"
    );

    if (storeImgIntoBucket) {
      storageLocation = storeImgIntoBucket;
    }

    const user = await user_details.getPersonalDetails(ophid);

    if (user.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
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
      return res
        .status(201)
        .json({ success: true, message: "Data updated successfully" });
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
    // 1. Extract token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // 2. Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.SECRET_KEY);
    } catch (err) {
      console.error("JWT verification error:", err.message);
      return res
        .status(401)
        .json({ success: false, message: "Invalid or expired token" });
    }

    // 3. Get ophid from query string
    const { ophid } = req.query;

    if (!ophid) {
      return res.status(400).json({
        success: false,
        message: "Missing 'ophid' in request query",
      });
    }

    // 4. Fetch user details
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
