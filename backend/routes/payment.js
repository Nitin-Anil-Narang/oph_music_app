const express = require("express")
const router = express.Router()
const {payment} = require("../controllers/payment")

router.route("/auth/payment").post(payment)


module.exports = router