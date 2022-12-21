const multer = require('multer');

// list of MIME types
const MIME_TYPES = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
};

// multer config
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './images');
    },
    filename: (req, file, callback) => {
        const extension = MIME_TYPES[file.mimetype];
        const name = file.originalname.split(' ').join('_').split('.')[0];
        callback(null, name + Date.now() + '.' + extension);
    },
});

module.exports = multer({ storage: storage }).single('image');
