const express = require("express");
const router = express.Router();
const multer = require("multer");
const { insertSongDetailsController } = require("../controllers/song_details");

const upload = multer({ storage: multer.memoryStorage() }); // For S3 upload

router.post("/audio-details", insertSongDetailsController);

module.exports = router;
