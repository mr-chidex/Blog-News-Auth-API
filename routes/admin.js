const expressPromise = require("express-promise-router");
const router = expressPromise();
const adminControllers = require("../controllers/admin");
const uploadImage = require("../handlers/multer");
const passport = require("passport");
const jwtStrategy = require("../middleware/passport");

router.route("/")
    .post(uploadImage.single("image"), adminControllers.signup);

router.route("/signin")
    .post(adminControllers.signin);

router.route("/")
    .get(passport.authenticate("jwt", { session: false }), adminControllers.getAllAdmin);

module.exports = router;