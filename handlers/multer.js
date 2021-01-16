const multer = require("multer");
const { v4 } = require("uuid");

const filter = async (req, file, cb) => {
    try {

        if (file.mimetype === "image/jpg" || file.mimetype === "image/png" || file.mimetype === "image/jpeg") {
            cb(null, true)
        }
        else {
            throw new Error("please upload an image file: Unacceptable file format");
        }
    }
    catch (err) {
        err.statusCode = 400;
        cb(err, false)
    }
}

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "images");
    },
    filename: (req, file, cb) => {
        cb(null, v4() + "-" + file.originalname);
    }
})

module.exports = multer({ storage: fileStorage, fileFilter: filter, limits: { fileSize: 500000 } });