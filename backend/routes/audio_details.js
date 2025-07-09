const express = require("express");
const router = express.Router();
const multer = require("multer");
const { insertSongDetailsController } = require("../controllers/audio_details");

const upload = multer({ storage: multer.memoryStorage() }); // For S3 upload
const authMiddleware = require("../middleware/authenticate")

router.post("/audio-details", authMiddleware , upload.single("audio_file") ,insertSongDetailsController);

module.exports = router;
