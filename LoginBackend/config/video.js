const zod = require("zod");

const uploadVideo = zod.object({
    videoTitle: zod.string().min(1),
    videoDescription: zod.string(),
    videoGenre: zod.string(1)
});

module.exports = { uploadVideo };