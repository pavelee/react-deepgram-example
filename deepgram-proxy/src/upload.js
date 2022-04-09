const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const generateTemporaryFileName = (extension = "wav") => {
    return uuidv4() + "." + extension;
};

const storage = multer.diskStorage({
    filename: function (req, file, cb) {
        cb(null, generateTemporaryFileName());
    },
    destination: function (req, file, cb) {
        cb(null, "./uploads");
    },
});

const upload = multer({ storage });

module.exports = upload;
