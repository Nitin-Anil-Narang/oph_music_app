const express = require("express");
const router = express.Router();

const { insertVideoDetails } = require("../controllers/songs_register");

// POST route to add new song
router.post("/register-song", insertVideoDetails);

module.exports = router;
