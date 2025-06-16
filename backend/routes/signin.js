const express = require("express")
const router = express.Router()
const {signin} = require("../controllers/signin")

router.route("/auth/signin").post(signin)


module.exports = router