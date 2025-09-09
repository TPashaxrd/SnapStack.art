const express = require("express")
const { CreateSubs } = require("../controllers/subscribe")

const router = express.Router()

router.post("/subscribe", CreateSubs)

module.exports = router