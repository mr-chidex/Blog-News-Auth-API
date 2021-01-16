const mongoose = require("mongoose");
const deleteImage = require("../handlers/deleteImage")
const { Blog, validateBlog } = require("../model/blog");

module.exports = {
    getAllPost: async (req, res, next) => {
        try {
            const { category } = req.query;
            if (category) {
                const blog = await Blog.find({ category }).select("-__v -authorId").sort("-_id");
                if (blog.length <= 0) return res.json({ message: "no blog post of this category available" })
                return res.status(200).json({ message: 'all blog post', blog })
            }

            const blog = await Blog.find().select("-__v -authorId").sort("-_id");
            if (blog.length <= 0) return res.json({ message: "no blog post available" })
            res.status(200).json({ message: 'all blog post', blog })
        }
        catch (err) {
            next(new Error("Error getting blog post"))
        }
    },

    addBlogPost: async (req, res, next) => {
        const { error, value } = validateBlog(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message })

        const { title, excerpt, content, category, readTime } = value;

        //check if image was uploaded
        if (!req.file) { return res.status(400).json({ message: "No image entered" }) }

        //get admin details
        const admin = req.user;
        const adminName = `${admin.firstname} ${admin.lastname}`;
        const adminImage = admin.image
        const adminId = admin._id;

        let blog = await new Blog({
            title,
            excerpt,
            content,
            category,
            readTime,
            image: req.file.path,
            author: adminName,
            authorImage: adminImage,
            authorId: adminId
        });

        blog = await blog.save();
        if (!blog) return res.status(500).json({ message: "adding new blog post failed " })
        res.status(201).json({ message: 'blog post successfully added', blog })
    },

    getSingleBlogPost: async (req, res) => {
        const { blogId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(blogId)) return res.status(400).json({ message: "Invalid Id" })

        let blog = await Blog.findById(blogId).select("-__v -authorId");
        if (!blog) return res.status(400).json({ message: "blog post with such ID does not exist" });

        // increase blog views by 1 
        blog.views += 1;

        blog = await blog.save();
        res.status(200).json({ blog });
    },

    editBlogPost: async (req, res) => {
        const { blogId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(blogId)) return res.status(400).json({ message: "Invalid Id" })

        let blog = await Blog.findById(blogId).select("-__v");
        if (!blog) return res.status(400).json({ message: "blog post with such ID does not exist" });

        // check if post was added by this admin
        if (blog.authorId.toString() !== req.user._id.toString()) return res.status(401).json({ message: "Unauthorize: Not allowed to update this post " })

        //validate entries
        const { error, value } = validateBlog(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message })

        const { title, excerpt, content, category, readTime } = value;
        blog.title = title;
        blog.excerpt = excerpt;
        blog.content = content;
        blog.category = category;
        blog.readTime = readTime;

        //check if image was uploaded
        if (req.file) {
            //delete old image
            deleteImage(blog.image)

            //update with new image
            blog.image = req.file.path;
        }

        blog = await blog.save();
        if (!blog) return res.status(500).json({ message: "editing blog post failed" })
        res.status(200).json({ message: 'blog post updated sucessfully', blog })
    },

    deleteBlogPost: async (req, res) => {
        const { blogId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(blogId)) return res.status(400).json({ message: "Invalid Id" });

        let blog = await Blog.findById(blogId);
        if (!blog) return res.status(400).json({ message: "blog post with such ID does not exist" });

        // check if post was added by this admin
        if (blog.authorId.toString() !== req.user._id.toString()) return res.status(401).json({ message: "Unauthorize: Not allowed to delete this post " })

        blog = await Blog.findByIdAndDelete({ _id: blogId }).select("-__v -authorId");

        // delete existing image
        deleteImage(blog.image);

        res.status(200).json({ message: 'blog post sucessfully deleted', blog })
    }
}