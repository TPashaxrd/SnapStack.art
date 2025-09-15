const express = require("express")
const { CreateReport, showAllReports } = require("../controllers/Report")
const adminAuth = require("../middlewares/isAdmin")

const router = express.Router()

router.post("/", CreateReport)
router.post("/show", adminAuth, showAllReports)

module.exports = router