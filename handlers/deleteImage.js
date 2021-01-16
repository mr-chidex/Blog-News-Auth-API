const fs = require("fs");
const logger = require("../middleware/logger");

module.exports = async (imagePath) => {
    try {
        fs.unlink(imagePath, err => {
            if (err) {
                logger.log("error", "error deleting image or no file exist")
            }
        })
    }
    catch (error) {
        logger.log("error", "error path")
    }
}