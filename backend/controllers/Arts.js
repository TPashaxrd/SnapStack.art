const Arts = require("../models/Arts");

const CreateArt = async (req, res) => {
  try {
    console.log("Session:", req.session); 
    console.log("UserId in session:", req.session?.userId);

    const { title, tags } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "You need upload picture." });
    }

    if (!req.session?.userId) {
      return res.status(401).json({ message: "You must be logged in." });
    }

    const newArt = new Arts({
      user: req.session.userId,
      title,
      view,
      imageUrl: `/uploads/${req.file.filename}`,
      tags: tags ? tags.split(",") : [],
      comments: [],
      likes: 0
    });

    await newArt.save();
    res.status(201).json(newArt);
  } catch (error) {
    console.error("CreateArt error:", error);
    res.status(500).json({ error: error.message });
  }
};

const showAllArts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    const skip = parseInt(req.query.skip) || 0;

    const arts = await Arts.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "username email avatarUrl bio"); 
      
    res.json(arts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

  
  const incrementViews = async (req, res) => {
    try {
      const { id } = req.params;
  
      const art = await Arts.findById(id);
      if (!art) return res.status(404).json({ message: "Art not found." });
  
      art.view = (art.view || 0) + 1; 
      await art.save();
  
      res.status(200).json({ message: "View incremented", view: art.view });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

module.exports = { CreateArt, showAllArts, incrementViews };