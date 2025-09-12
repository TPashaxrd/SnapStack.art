const Saveds = require("../models/Saveds");

const SaveArt = async (req, res) => {
    try {
        const { artId } = req.body;
        const userId = req.session.userId;

        const exist = await Saveds.findOne({ user: userId, art: artId })
        if(exist) return res.status(400).json({ message: "Already saved!" })

        const saved = await Saveds.create({ user: userId, art: artId })
        res.status(201).json({ success: true, saved })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getSavedArts = async (req, res) => {
    try {
        const userId = req.session.userId;

        const savedArts = await Saveds.find({ user: userId })
        .populate('art')
        .sort({ createdAt: -1 })

        res.status(200).json({ success: true, savedArts})
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

const unSaveArt = async (req, res) => {
    try {
      const userId = req.session.userId;
      const { artId } = req.params;
      console.log("userId:", userId, "artId:", artId);
  
      const deleted = await Saveds.findOneAndDelete({ user: userId, art: artId });
      if (!deleted) return res.status(404).json({ message: "Not found" });
  
      res.status(200).json({ message: "Unsaved successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
module.exports = { SaveArt, getSavedArts, unSaveArt }