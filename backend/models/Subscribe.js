const mongoose = require("mongoose")

const SubsSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    IP_Address: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model("Subscribes", SubsSchema)