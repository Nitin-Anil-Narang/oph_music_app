const express = require('express');
const router = express.Router();
const personalDetails = require('../controllers/personal_details');
const multer = require("multer");
const authMiddleware = require("../middleware/authenticate")

const upload = multer({ storage: multer.memoryStorage() });

router.post('/auth/personal-details', authMiddleware ,upload.single("profile_image"),personalDetails.insertPersonalDetails);
router.get('/auth/personal-details',  authMiddleware,personalDetails.mapPersonalDetails);
router.get('/auth/personal',  personalDetails.getAllPersonal);

module.exports = router;