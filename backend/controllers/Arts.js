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

  const setLike = async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.session?.userId; 
      if (!userId) return res.status(401).json({ message: "Giriş yapmalısın" });
  
      const art = await Arts.findById(id);
      if (!art) return res.status(404).json({ message: "Art not found." });
  
      if (art.likedBy.includes(userId)) {
        art.likedBy = art.likedBy.filter(u => u.toString() !== userId.toString());
        art.likes = Math.max((art.likes || 1) - 1, 0);
        await art.save();
        return res.status(200).json({ message: "Disliked.", likes: art.likes });
      } else {
        art.likedBy.push(userId);
        art.likes = (art.likes || 0) + 1;
        await art.save();
        return res.status(200).json({ message: "Liked.", likes: art.likes });
      }
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  };
  

const getArtById = async (req, res) => {
  try {
    const { id } = req.params;
    const art = await Arts.findById(id)
    .populate("user", "username avatarUrl")
    .populate("comments.user", "username avatarUrl");

    if(!art) {
      return res.status(500).json({ message: "Art not found."})
    }

    const userId = req.session?.userId;
    const liked = userId ? art.likedBy.includes(userId) : false;

    res.status(200).json({ ...art.toObject(), liked })
    // res.json(art)
  } catch (error) {
    res.status(500).json({ message: error })
  }
}

const addComment = async (req, res) => {
  try {
    const { comment } = req.body;
    const userId = req.session.userId;

    if (!comment || !userId) {
      return res.status(400).json({ message: "Eksik bilgi" });
    }

    const art = await Arts.findById(req.params.id);
    if (!art) return res.status(404).json({ message: "Art bulunamadı" });

    art.comments.push({ user: userId, comment, date: new Date() });
    await art.save();

    const updatedArt = await Arts.findById(req.params.id)
      .populate("comments.user", "username avatarUrl")
      .populate("user", "username avatarUrl");

    res.status(200).json({ message: "Yorum eklendi", comments: updatedArt.comments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = { CreateArt, showAllArts, incrementViews, getArtById, addComment, setLike };