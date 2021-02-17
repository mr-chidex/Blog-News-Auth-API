const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const Joi = require("joi");
const bcryptJs = require("bcryptjs");
const JWT = require("jsonwebtoken");

const adminSchema = new Schema({
    firstname: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
        default: ""
    },
    lastname: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
        default: ""
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        minlength: 5,
        maxlength: 255,
    },
    phone: {
        type: String,
        required: true,
        trim: true,
        default: ""
    },
    role: {
        type: String,
        required: true,
        enum: ["shop", "shop&content-editor", "content-editor"]
    },
    image: {
        type: String,
        default: ""
    },
    isConfirmed: {
        type: Boolean,
        default: false
    },
    superAdmin: {
        type: Boolean,
        default: false
    },
    password: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 1024
    }

}, { timestamps: true })

adminSchema.pre("save", async function (next) {
    try {
        const salt = await bcryptJs.genSalt(12);
        const hashedPassword = await bcryptJs.hash(this.password, salt);
        this.password = hashedPassword;
        next();
    }
    catch (err) {
        next(err);
    }
})

//validate entry on signing up in
const validateAdmin = (admin) => {
    const adminSchema = Joi.object({
        firstname: Joi.string().min(3).max(50).trim().required(),
        lastname: Joi.string().min(3).max(50).trim().required(),
        email: Joi.string().trim().max(255).email().required().normalize(),
        phone: Joi.string().trim().messages({ 'string.trim': 'phone number must not contain white space' }).required(),
        role: Joi.string().trim().required(),
        password: Joi.string().min(3).trim().required()
    });

    return adminSchema.validate(admin)
}

//validate entry on signing in
const validateOnSignIn = (admin) => {
    const adminSchema = Joi.object({
        email: Joi.string().trim().max(255).email().required().normalize(),
        password: Joi.string().min(3).trim().required()
    });

    return adminSchema.validate(admin)
}

// generate token
const generateToken = (admin) => {
    const jwtToken = JWT.sign({
        iss: "GARNETCARE FOUNDATION",
        iat: new Date().getTime(),
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60),
        sub: admin
    }, process.env.SECRET_KEY)
    return jwtToken;
}

module.exports = {
    Admin: mongoose.model("Admin", adminSchema),
    validateAdmin,
    generateToken,
    validateOnSignIn
}

