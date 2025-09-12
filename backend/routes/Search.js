const express = require("express")
const { Search } = require("../controllers/search")

const router = express.Router()

router.get("/", Search)

module.exports = router