const express = require("express");
const router = express.Router(); 
const membershipForm = require("../controllers/membership");

router.get("/auth/membership",membershipForm);

module.exports = router;