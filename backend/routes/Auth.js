const express = require("express")
const { CreateUser, Login, Logout, me, getArtsByUser } = require("../controllers/Auth")

const router = express.Router()

router.post("/register", CreateUser)
router.post("/login", Login)
router.get("/logout", Logout)
router.get("/me", me)
router.put("/me", me)
router.get("/user/:username", getArtsByUser)


module.exports = router