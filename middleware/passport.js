const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const { ExtractJwt } = require("passport-jwt");
const { Admin } = require("../model/admin");

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
            done(error, false);
        }
    }))