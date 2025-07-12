const express = require("express");
const router = express.Router();
const userDetails = require("../controllers/allArtist");

// GET /user-details/under-review/:ophid
router.get("/completed", userDetails.getAllUserDetails);
router.get("/completed/:ophid", userDetails.getAllDetails);

module.exports = router;