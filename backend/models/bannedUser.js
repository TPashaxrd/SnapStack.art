const mongoose = require("mongoose")

const BannedSchema = new mongoose.Schema({
    reason: {
        type: String,
        default: "No Reason."
    },
    userUserId: {
        type: String,
        required: true
    },
    userEmail: {
        type: String,
        required: true
    },
    userUsername: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model("Banneds", BannedSchema)