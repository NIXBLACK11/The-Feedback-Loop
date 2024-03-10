const mongoose = require("mongoose");
require('dotenv').config();

const MONGO_URL = process.env.MONGO_URL;

mongoose.connect(MONGO_URL);

const VideoSchema = new mongoose.Schema({
    videoTitle: { type: String, required: true },
    videoDescription: String,
    videoPath: String,
    videoUploadDate: { type: Date, default: Date.now },
    videoGenre: String
});

const Video = mongoose.model('Video', VideoSchema);

module.exports = { Video };