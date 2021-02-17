const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const { ExtractJwt } = require("passport-jwt");
const { OAuth } = require("../model/oauth");
const { Admin } = require("../model/admin");
const FacebookTokenStrategy = require("passport-facebook-token");
const GoogleTokenStrategy = require("passport-google-plus-token");

passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromHeader("authorization"),
    secretOrKey: process.env.SECRET_KEY
},
    async (payload, done) => {
        try {
            const admin = await Admin.findById(payload.sub);
            if (!admin) {
                done(null, false)
            }

            done(null, admin);
        }
        catch (error) {
            done(error, false, error.message);
        }
    }))

//facebook OAuth
passport.use("facebookToken", new FacebookTokenStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            //check if we already have a user
            const user = await OAuth.findOne({ oauthId: profile.id });
            if (user) return done(null, user);

            //if no user, create new user
            const newUser = await new OAuth({
                method: "facebook",
                oauthId: profile.id,
                email: profile.emails[0].value,
                firstname: profile.name.givenName,
                lastname: profile.name.familyName
            })

            await newUser.save();
            done(null, newUser)
        }
        catch (error) {
            done(error, false, error.message)
        }
    }))

//googleOAuth
passport.use("googleToken", new GoogleTokenStrategy({
    clientID: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_SECRET,
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            //check if we already have a user
            const user = await OAuth.findOne({ oauthId: profile.id });
            if (user) return done(null, user);

            //if no user, create new user
            const newUser = await new OAuth({
                method: "google",
                oauthId: profile.id,
                email: profile.emails[0].value,
                firstname: profile.name.givenName,
                lastname: profile.name.familyName
            })

            await newUser.save();
            done(null, newUser)
        }
        catch (error) {
            done(error, false, error.message)
        }
    }))