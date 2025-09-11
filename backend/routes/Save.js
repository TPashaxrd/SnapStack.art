const express = require("express")
const { SaveArt, getSavedArts, unSaveArt } = require("../controllers/Saved")

const router = express.Router()

router.post("/save", SaveArt)
router.get("/my-saveds", getSavedArts)
router.delete("/unsave", unSaveArt)

module.exports = router