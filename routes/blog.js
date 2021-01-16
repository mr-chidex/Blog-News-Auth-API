const expressPromise = require("express-promise-router");
const router = expressPromise();
const uploadImage = require("../handlers/multer");
const passport = require("passport");
const jwtStrategy = require("../middleware/passport");

//blog controllers
const blogControllers = require("../controllers/blog");

router.route("/").
    get(blogControllers.getAllPost);

router.route("/").
    post(passport.authenticate("jwt", { session: false }), uploadImage.single("image"), blogControllers.addBlogPost);

router.route("/:blogId").
    get(blogControllers.getSingleBlogPost);

router.route("/:blogId").
    put(passport.authenticate("jwt", { session: false }), uploadImage.single("image"), blogControllers.editBlogPost);

router.route("/:blogId").
    delete(passport.authenticate("jwt", { session: false }), blogControllers.deleteBlogPost);

module.exports = router;