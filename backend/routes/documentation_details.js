const express = require("express");
const multer = require("multer");
const router = express.Router();
const controller = require("../controllers/documentation_details");
const authMiddleware = require("../middleware/authenticate");

const upload = multer({ storage: multer.memoryStorage() });
router.get(
  "/auth/documentation-details",
  authMiddleware,
  controller.getDocumentByOphIdController
);

router.post(
  "/auth/documentation-details",
  authMiddleware,

  upload.fields([
    { name: "AadharFrontURL", maxCount: 1 },
    { name: "AadharBackURL", maxCount: 1 },
    { name: "PanFrontURL", maxCount: 1 },
    { name: "signatureImage", maxCount: 1 },
  ]),
  controller.insertDocumentationController
);

module.exports = router;
