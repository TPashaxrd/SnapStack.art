const express = require("express")
const { CreateContact, showAllContacts } = require("../controllers/Contact")

const router = express.Router()

router.post("/create", CreateContact)
router.get("/all", showAllContacts)

module.exports = router