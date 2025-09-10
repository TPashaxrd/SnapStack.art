const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    avatarUrl: {
        type: String,
        default: "/uploads/avatars/default-avatar.png"
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
    date: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model("Users", userSchema)