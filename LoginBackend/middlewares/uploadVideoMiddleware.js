const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads/'));
    },
    filename: function (req, file, cb) {
        try {
            req.fileName = file.originalname;
            cb(null, file.originalname);
        } catch (error) {
            cb(error);
        }
    }
});

const upload = multer({ storage: storage });

const uploadVideoMiddleware = (req, res, next) => {
    upload.single('video')(req, res, (err) => {
        if (err) {
            console.error('Error in uploadVideoMiddleware:', err.message);
            return res.status(500).json({ message: 'File upload failed' });
        }
        next();
    });
};

module.exports = {
    uploadVideoMiddleware,
};