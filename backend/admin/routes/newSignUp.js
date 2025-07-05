const express = require('express');
const router = express.Router();
const {getAllOphIdsWithRegistration , getSingleUserDetails}= require("../controllers/newSignUp")



router.get('/newsignup', getAllOphIdsWithRegistration );
router.get("/user-details/:ophid", getSingleUserDetails);


module.exports = router