const express = require("express")

const router = express.Router()
const {signup,getAllPersonal} = require("../controllers/adminSignUp")

router.route("/admin/signup").post(signup)
router.route("/admin/personal").get(getAllPersonal)


module.exports = router