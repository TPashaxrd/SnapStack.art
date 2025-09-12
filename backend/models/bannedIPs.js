const mongoose = require("mongoose")

const BannedSchema = new mongoose.Schema({
    IP_Address: {
        type: String,
        required: true
    },
    reason: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model("Banned", BannedSchema)