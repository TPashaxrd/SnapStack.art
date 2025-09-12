const express = require("express")
const { CreateContact, showAllContacts } = require("../controllers/Contact")
const adminAuth = require("../middlewares/isAdmin")

const router = express.Router()

router.post("/create", CreateContact)
router.post("/all", adminAuth, showAllContacts)

module.exports = router