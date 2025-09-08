const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    avatarUrl: {
        type: String,
        default: "https://static.vecteezy.com/system/resources/thumbnails/019/879/186/small_2x/user-icon-on-transparent-background-free-png.png"
    },
    bio: {
        type: String,
        default: "No bio yet."
    },
    email: {
        type: String,
        required: true
    },
    IP_Address: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
})

module.exports = mongoose.model("Users", userSchema)