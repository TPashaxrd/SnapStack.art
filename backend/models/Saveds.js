const mongoose = require("mongoose")

const SavedSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Users',
        required: true
    },
    art: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Arts',
        required: true
    }
})

module.exports = mongoose.model("Saveds", SavedSchema)