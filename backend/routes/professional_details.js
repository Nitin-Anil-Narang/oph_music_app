const express = require("express");
const router = express.Router();
const multer = require("multer");
const controller = require("../controllers/professional_details");
const authMiddleware = require("../middleware/authenticate")

const upload = multer({ storage: multer.memoryStorage() });

router.get("/auth/professional-details", authMiddleware, controller.getProfessionalByOphId)

// Route with Multer handling video and photos
router.post(
  "/auth/professional-details",
  authMiddleware,
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "photos", maxCount: 5 }, // support multiple images
  ]),
  controller.insertProfessionalDetails
);

// Optional GET route to test fetch
// router.get("/prof/:ophid", controller.getProfessionalDetailsByOphId);

module.exports = router;