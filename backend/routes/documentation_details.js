const express = require("express");
const multer = require("multer");
const router = express.Router();
const { insertDocumentationController } = require("../controllers/documentation_details");

const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/insertdoc",
  upload.fields([
    { name: "aadharFront", maxCount: 1 },
    { name: "aadharBack", maxCount: 1 },
    { name: "panFront", maxCount: 1 },
    { name: "panBack", maxCount: 1 },
    { name: "signatureImage", maxCount: 1 }
  ]),
  insertDocumentationController
);

module.exports = router;
