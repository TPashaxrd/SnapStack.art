const mongoose = require("mongoose")

const ArtSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    comments: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users'},
            comment: { type: String, required: true },
            date: { type: Date, default: Date.now }
        } 
    ],
    tags: [String],
    likes: {
        type: Number,
        default: 0
    },
    date: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model("Arts", ArtSchema)