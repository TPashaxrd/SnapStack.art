const mongoose = require("mongoose")

const ReportSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Users', 
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    artId: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model("Report", ReportSchema)