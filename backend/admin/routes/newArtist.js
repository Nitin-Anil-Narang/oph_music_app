const express = require("express");
const router = express.Router();
const userDetailsController = require("../controllers/newArtist");

// GET /user-details/under-review/:ophid
router.get("/under-review/:ophid", userDetailsController.getAllDetailsUnderReview);
router.get("/any-under-review", userDetailsController.getAllUserDetailsIfAnyStepUnderReview);

module.exports = router;
