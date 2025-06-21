const express = require("express");
const router = express.Router(); 
const { payment } = require("../controllers/payment");

router.post("/auth/payment",payment);

module.exports = router;
