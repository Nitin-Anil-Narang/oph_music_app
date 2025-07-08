const express = require("express")
const router = express.Router()
const {signin,updateAdminRole} = require("../controllers/adminSignIn")

router.route("/admin/signin").post(signin);
router.put('/admin/update-role', updateAdminRole);


module.exports = router