const express = require("express")
const { resetPassword, forgotPassword } = require("../controllers/password")

const router = express.Router()

router.post("/reset-password/:token", resetPassword)
router.post("/forgot-password", forgotPassword)

module.exports = router