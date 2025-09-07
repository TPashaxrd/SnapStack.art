const express = require("express")
const { CreateUser, Login, Logout, me } = require("../controllers/Auth")

const router = express.Router()

router.post("/register", CreateUser)
router.post("/login", Login)
router.post("/logout", Logout)
router.get("/me", me)
router.put("/me", me)


module.exports = router