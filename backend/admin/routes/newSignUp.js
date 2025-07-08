const express = require('express');
const router = express.Router();
const {getAllOphIdsWithRegistration , getSingleUserDetails,getTransactionDetails}= require("../controllers/newSignUp")



router.get('/newsignup', getAllOphIdsWithRegistration );
router.get("/user-details/:ophid", getSingleUserDetails);
router.get("/transaction-details/:ophid", getTransactionDetails);


module.exports = router