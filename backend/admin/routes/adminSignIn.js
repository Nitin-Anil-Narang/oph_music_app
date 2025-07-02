const express = require("express")
const router = express.Router()
const {signin} = require("../controllers/adminSignIn")

router.route("/admin/signin").post(signin)


module.exports = router