const express = require("express");
const router = express.Router();

const { insertSongController } = require("../controllers/songs_register");

// POST route to add new song
router.post("/register-song", insertSongController);

module.exports = router;
