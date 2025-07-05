const express = require("express");
const router = express.Router();

const { insertSongRegDetails } = require("../controllers/songs_register");

// POST route to add new song
router.post("/register-song", insertSongRegDetails);

module.exports = router;
