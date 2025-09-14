const mongoose = require("mongoose")

const badges =  new mongoose.Schema({
    name: { type: String, required: true },
    awardedAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true, index: { expires: 0 } }, 
})

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
    socials: {
        instagram: { type: String },
        twitter: { type: String },
        tiktok: { type: String },
        youtube: { type: String }
    },
    publicEmail: {
        type: String
    },
    badges: {
        type: [badges],
        default: []
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    date: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model("Users", userSchema)