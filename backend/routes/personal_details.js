const express = require('express');
const router = express.Router();
const personalDetails = require('../controllers/personal_details');
const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });

router.post('/auth/personal-details', upload.single("profile_image"),personalDetails.insertPersonalDetails);
router.get('/auth/personal-details', personalDetails.mapPersonalDetails);

module.exports = router;