const user_details = require("../model/signup.js");
const bcrypt = require("bcrypt");

const signup = async (req, res) => {
  try {
    const { name, stageName, email, contactNumber, confirmPassword, artistType } =
      req.body;

    // Check if user already exists
    const userExists = await user_details.getEmailAndNumber(
      email,
      contactNumber
    );
    if (userExists.length > 0) {
      return res
        .status(400)
        .json({ success: false, message: "Email or phone already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(confirmPassword, 10);

    // Insert user
    const dbResponse = await user_details.createUser(
      name,
      stageName,
      email,
      contactNumber,
      hashedPassword,
      artistType
    );

    if (dbResponse) {
      return res.status(200).json({ success: true, message: "Signup success" });
    }

    return res.status(500).json({ success: false, message: "Server error" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { signup };
