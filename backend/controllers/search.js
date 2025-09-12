const Users = require("../models/User")
const Arts = require("../models/Arts")

const Search = async (req, res) => {
  try {
    const { q } = req.query
    if (!q) return res.status(400).json({ message: "Query is required." })

    const users = await Users.find({
      $or: [
        { username: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } }
      ]
    }).select("-password").select("-IP_Address").limit(10)

    const arts = await Arts.find({
      $or: [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { tags: { $regex: q, $options: "i" } }
      ]
    }).limit(10)

    res.json({ users, arts })
  } catch (error) {
    console.error("Search error:", error)
    res.status(500).json({ message: "Search failed." })
  }
}

module.exports = { Search }