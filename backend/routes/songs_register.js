const express = require("express");
const router = express.Router();

const { insertNewSongRegDetails, insertHybridSongRegDetails, getSongRegistrationStatus } = require("../controllers/songs_register");
const authMiddleware = require("../middleware/authenticate")

// POST route to add new song
router.post("/register-new-song", authMiddleware, insertNewSongRegDetails);
router.post("/register-hybrid-song", authMiddleware, insertHybridSongRegDetails);
router.get("/get-song-registration-status", authMiddleware, getSongRegistrationStatus)

module.exports = router;
