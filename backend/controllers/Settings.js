const User = require("../models/User");
const bcrypt = require("bcryptjs");
const sessionStore = require("connect-mongo")
const mongoose = require("mongoose");

async function logoutAllSessions(userId) {
  const db = mongoose.connection.db;
  const collection = db.collection("sessions");

  await collection.deleteMany({ "session.userId": userId.toString() });
}


function isAuth(req, res, next) {
    if(!req.session.userId) return res.status(401).json({ message: "Not logged in" })
    next()
}

const ChangeUsername = async (req, res) => {
    try {
        const { username } = req.body;
        if(!username || username.length < 3) {
            return res.status({ message: "Username must be at least 3 characters."})
        }
        
        const user = await User.findById(req.session.userId);
        if(!user) return res.status(404).json({ message: "User not found." })
        
        user.username = username
        await user.save()

        res.json({ message: "Username updated successfully", username: user.username})
    } catch (error) {
        res.status(500).json({ message: error })
    }
}

const changeBio = async (req, res) => {
  try {
    const { bio } = req.body;

    if (!bio) {
      return res.status(400).json({ message: "Bio is required." });
    }

    const userId = req.session.userId;
    if (!userId) {
      return res.status(401).json({ message: "Not logged in" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.bio = bio;
    await user.save();

    res.json({ message: "Bio updated successfully", bio: user.bio });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


const changePassword = async (req, res) => {
    try {
      const userId = req.session.userId;
      if (!userId) return res.status(401).json({ message: "Not logged in" });
  
      const { oldPassword, newPassword } = req.body;
      if (!oldPassword || !newPassword) return res.status(400).json({ message: "All fields are required" });
  
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });
  
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) return res.status(400).json({ message: "Old password is incorrect" });
  
      const hashed = await bcrypt.hash(newPassword, 10);
      user.password = hashed;

      await logoutAllSessions(user._id)

      await user.save();
  
      res.json({ message: "Password updated successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
};


const changeAvatar = async (req, res) => {
  try {
    if(!req.session.userId) return res.status(401).json({ message: "Not logged in" })
    
    const user = await User.findById(req.session.userId)
    if(!user) return res.status(404).json({ message: "User not found" })
    
    user.avatarUrl = "/uploads/avatars/" + req.file.filename;
    await user.save()

    res.json({ message: "Avatar updated", avatarUrl: user.avatarUrl })
  } catch (error) {
    res.status(500).json({ message: "Server error" + err})
  }
}

const changeSocials = async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ message: "Not logged in" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { instagram, twitter, tiktok, youtube } = req.body;

    const usernameRegex = /^[a-zA-Z0-9._]{1,30}$/; 

    if (instagram && !usernameRegex.test(instagram)) {
      return res.status(400).json({ message: "Invalid Instagram username. example: snapstack" });
    }
    if (twitter && !usernameRegex.test(twitter)) {
      return res.status(400).json({ message: "Invalid Twitter username. example: snapstack" });
    }
    if (tiktok && !usernameRegex.test(tiktok)) {
      return res.status(400).json({ message: "Invalid TikTok username. example: snpastack" });
    }
    if (youtube && !usernameRegex.test(youtube)) {
      return res.status(400).json({ message: "Invalid YouTube username. example: snapstack" });
    }


    if (instagram !== undefined) user.socials.instagram = instagram;
    if (twitter !== undefined) user.socials.twitter = twitter;
    if (tiktok !== undefined) user.socials.tiktok = tiktok;
    if (youtube !== undefined) user.socials.youtube = youtube;

    await user.save();

    res.json({ message: "Socials updated successfully", socials: user.socials });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const changePublicMail = async (req, res) => {
  try {
    const userId = req.session.userId;
    if(!userId) return res.status(401).json({ message: "Not loggeed in" })

    const user = await User.findById(userId)
    if(!user) return res.status(404).json({ message: "User not found" })

    const { publicEmail } = req.body;
    
    user.publicEmail = publicEmail

    await user.save()

    res.json({ message: "Public email updated successfully!", publicEmail: user.publicEmail })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { isAuth, ChangeUsername, changePassword, changeAvatar, changeBio, changeSocials, changePublicMail }