const mongoose = require('mongoose')

// create post schema
const postSchema = new mongoose.Schema({
    title: { type: String, require: true },
    description: { type: String, require: true },
    createdAt: { type: Date, default: Date.now },
    createdby: { type: String, required: true }
})

module.exports = mongoose.model('Post', postSchema);