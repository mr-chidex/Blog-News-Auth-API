const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const Joi = require("joi");

const newsSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    excerpt: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    authorImage: {
        type: String,
        required: true
    },
    authorId: {
        type: Schema.Types.ObjectId,
        ref: "Admin",
        required: true
    },
    views: {
        type: Number,
        default: 0
    }
}, { timestamps: true })

const validateNews = (news) => {
    const validateSchema = Joi.object({
        title: Joi.string().trim().required(),
        excerpt: Joi.string().trim().required(),
        content: Joi.string().trim().required(),
        category: Joi.string().trim().required(),
    });

    return validateSchema.validate(news);
}


module.exports = {
    News: mongoose.model("News", newsSchema),
    validateNews
}