const expressPromise = require("express-promise-router");
const router = expressPromise();
const uploadImage = require("../handlers/multer");
const passport = require("passport");
const jwtStrategy = require("../middleware/passport");

const newsControllers = require("../controllers/news");

router.route("/")
    .get(newsControllers.getAllNews);

router.route("/")
    .post(passport.authenticate("jwt", { session: false }), uploadImage.single("image"), newsControllers.addNewNews);

router.route("/:newsId")
    .get(newsControllers.getSingleNews);

router.route("/:newsId")
    .put(passport.authenticate("jwt", { session: false }), uploadImage.single("image"), newsControllers.editNews);

router.route("/:newsId")
    .delete(passport.authenticate("jwt", { session: false }), newsControllers.deleteNews);

module.exports = router;