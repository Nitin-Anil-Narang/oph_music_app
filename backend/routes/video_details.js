const express = require("express");
const router = express.Router();
const multer = require("multer");
// const authMiddleware = require("../middleware/authenticate");

const controller = require("../controllers/video_details");

// store the file in memory; your controller calls uploadToS3
const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/video-details",
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "photos", maxCount: 3 }, // support multiple images
  ]),
  controller.createVideoDetails
);

// router.get("/video-details", controller.getVideoDetails);

module.exports = router;
