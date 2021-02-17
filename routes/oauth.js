const expressPromise = require("express-promise-router");
const router = expressPromise();
const { facebook, google } = require("../controllers/oauth");
const passport = require("passport");
const jwtStrategy = require("../middleware/passport");


router.route("/facebook")
    .post(passport.authenticate("facebookToken", { session: false }), facebook)

router.route("/google").post(passport.authenticate("googleToken", { session: false }), google)


module.exports = router;