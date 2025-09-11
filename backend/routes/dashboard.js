const express = require("express")
const { totals, users, arts } = require("../controllers/dashboard")
const isAdmin = require("../middlewares/isAdmin")
const router = express.Router()

router.post("/totals", isAdmin, totals)
router.post("/users", isAdmin, users)
router.post("/arts", isAdmin, arts)

module.exports = router