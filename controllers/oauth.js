const { generateToken } = require("../model/oauth")


module.exports = {
    facebook: (req, res, next) => {

        const token = generateToken(req.user._id);
        res.json({ user: req.user, token })
    },
    google: (req, res, next) => {
        const token = generateToken(req.user._id);
        res.json({ user: req.user, token })

    }
}