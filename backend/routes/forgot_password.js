const express = require("express");
const router = express.Router(); 
const { forgotPassword } = require("../controllers/forgot_password");

router.post("/auth/forgot-password",forgotPassword);

module.exports = router;
