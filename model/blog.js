const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const Joi = require("joi");

const blogSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    image: {
        type: String
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
    readTime: {
        type: Number,
        required: true,
        default: 3
    },
    views: {
        type: Number,
        default: 0
    }
}, { timestamps: true })

const Blog = mongoose.model("Blog", blogSchema);

const validateNewPost = (blog) => {
    const validateSchema = Joi.object({
        title: Joi.string().trim().required(),
        excerpt: Joi.string().trim().required(),
        content: Joi.string().trim().required(),
        category: Joi.string().trim().required(),
        readTime: Joi.string().required()
    })

    return validateSchema.validate(blog);
}

exports.Blog = Blog;
exports.validateBlog = validateNewPost;