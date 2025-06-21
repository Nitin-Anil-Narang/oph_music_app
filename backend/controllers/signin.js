const user_details = require("../model/signin.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await user_details.findUserByEmail(email);

    if (user.length === 0) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    const dbUser = user[0];
    const isPasswordValid = await bcrypt.compare(password, dbUser.user_pass);

    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: "1h" });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token:token
    });

  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { signin };
