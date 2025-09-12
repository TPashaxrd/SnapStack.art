const express = require("express")
const multer = require("multer")
const path = require("path")
const { isAuth, ChangeUsername, changePassword, changeAvatar, changeBio, changeSocials, changePublicMail } = require("../controllers/Settings")

const router = express.Router()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/avatars/");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });
  
  const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const ext = path.extname(file.originalname).toLowerCase();
    const mime = file.mimetype;
  
    if (allowedTypes.test(ext) && allowedTypes.test(mime)) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed (jpg, png, gif, webp)."));
    }
  };
  
  const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 }, 
  });
  

router.post("/username", isAuth, ChangeUsername)
router.post("/password", isAuth, changePassword)
router.post("/change-socials", isAuth, changeSocials)
router.post("/change-public-email", isAuth, changePublicMail)
router.post("/update-avatar", isAuth, upload.single("avatar"), changeAvatar)
router.post("/bio", isAuth, changeBio)

module.exports = router