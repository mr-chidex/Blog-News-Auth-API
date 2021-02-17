const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const JWT = require("jsonwebtoken");

const oauthSchema = new Schema({
  method: { type: String },
  oauthId: { type: String },
  email: { type: String, lowercase: true },
  firstname: { type: String },
  lastname: { type: String },
});

// generate token
const generateToken = (admin) => {
  const jwtToken = JWT.sign(
    {
      iss: "GARNETCARE FOUNDATION",
      iat: new Date().getTime(),
      sub: admin,
    },
    process.env.SECRET_KEY,
    { expiresIn: "24h" }
  );
  return jwtToken;
};

module.exports = {
  OAuth: mongoose.model("OAuth", oauthSchema),
  generateToken,
};
