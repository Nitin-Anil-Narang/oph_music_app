const express = require("express");
const router = express.Router();

const { insertNewSongRegDetails, insertHybridSongRegDetails } = require("../controllers/songs_register");

// POST route to add new song
router.post("/register-new-song", insertNewSongRegDetails);
router.post("/register-hybrid-song", insertHybridSongRegDetails);

module.exports = router;
