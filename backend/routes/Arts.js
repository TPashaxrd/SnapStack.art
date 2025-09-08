const express = require("express");
const multer = require("multer");
const { CreateArt, showAllArts, incrementViews } = require("../controllers/Arts");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage });

const router = express.Router();

router.post("/create", upload.single("image"), CreateArt);
router.get("/all-arts", showAllArts)
router.patch("/view/:id", incrementViews)

module.exports = router;