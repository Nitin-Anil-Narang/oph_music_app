const express = require("express");
const router = express.Router(); 
const { resetPassword } = require("../controllers/reset_password");

router.post("/auth/reset-password",resetPassword);

module.exports = router;
