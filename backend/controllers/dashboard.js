const express = require("express")
const User = require("../models/User")
const Arts = require("../models/Arts")
const Subscribe = require("../models/Subscribe")
const dotenv = require("dotenv")

dotenv.config()

const totals = async (req, res) => {
    // const { password } = req.body;
    // const ADMIN_PASSWORD = process.env.ADMIN_KEY;
  
    // if (password !== ADMIN_PASSWORD) {
    //   return res.status(401).json({ success: false, message: "Unauthorized" });
    // }
  
    try {
      const UserCount = await User.countDocuments();
      const ArtCount = await Arts.countDocuments();
      const SubsCount = await Subscribe.countDocuments();
      const CommentsCount = await Arts.aggregate([{ $unwind: "$comments" }, { $count: "totalComments" }]);
  
      const dashboard = {
        UserCount,
        ArtCount,
        SubsCount,
        CommentsCount: CommentsCount[0]?.totalComments || 0
      };
  
      res.status(200).json({ success: true, dashboard });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

const users = async (req, res) => {
    // const { password } = req.body;
    // const ADMIN_PASSWORD = process.env.ADMIN_KEY;
    // if(password !== ADMIN_PASSWORD) {
    //     return res.status(401).json({ success: false, message: "Unauthorized" })
    // }
    try {
        const users = await User.find()
        res.status(201).json({ users })
    } catch (error) {
       res.status(500).json({ message: error.message }) 
    }
}
  

module.exports = { totals, users }