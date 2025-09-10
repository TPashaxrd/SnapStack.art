const express = require("express")
const { totals } = require("../controllers/dashboard")
const isAdmin = require("../middlewares/isAdmin")
const router = express.Router()

router.post("/totals", totals)

module.exports = router