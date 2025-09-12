const express = require("express")
const { totals, users, arts, DeleteUser, UpdateUser, UpdateArt, DeleteArt, ShowAllBanneds } = require("../controllers/dashboard")
const isAdmin = require("../middlewares/isAdmin")
const { DeleteContact } = require("../controllers/Contact")
const router = express.Router()

router.post("/totals", isAdmin, totals)
router.post("/users", isAdmin, users)
router.post("/arts", isAdmin, arts)
router.delete("/users/:id", isAdmin, DeleteUser)
router.put("/users/:id", isAdmin, UpdateUser)
router.put("/arts/:id", isAdmin, UpdateArt)
router.delete("/arts/:id", isAdmin, DeleteArt)
router.post("/banneds", isAdmin, ShowAllBanneds)
router.delete("/contact-delete/:id", isAdmin, DeleteContact)

module.exports = router