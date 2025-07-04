const express = require("express");
const router = express.Router();
const multer = require("multer");

const controller = require("../controllers/secondary_artist");

const upload = multer({ storage: multer.memoryStorage() });

// POST - Create secondary artist
router.post(
    "/secondary-artists",
  upload.fields([{ name: "artistPictureUrl", maxCount: 1 }]),
  controller.insertSecondaryArtist
);

// PUT - Update secondary artist
router.put(
  "/secondary-artists",
  upload.fields([{ name: "artistPictureUrl", maxCount: 1 }]),
  controller.updateSecondaryArtist
);

// GET - Fetch all secondary artists by OPH_ID
router.get("/secondary-artists", controller.getSecondaryArtistsByOphId);

module.exports = router;
