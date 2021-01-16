const { News, validateNews } = require("../model/news");
const mongoose = require("mongoose");
const delteImage = require("../handlers/deleteImage");
const deleteImage = require("../handlers/deleteImage");

module.exports = {
    getAllNews: async (req, res, next) => {
        const news = await News.find().select("-__v -authorId").sort("-_id");
        if (news.length < 1) return res.json({ message: "no news post available" });
        res.json({ news })
    },

    addNewNews: async (req, res, next) => {
        const { error, value } = validateNews(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const { title, excerpt, content, category } = value;
        if (!req.file) return res.status(400).json({ message: "no image uploaded" });
        const image = req.file.path;

        //get admin details
        const admin = req.user;
        const adminName = `${admin.firstname} ${admin.lastname}`;
        const adminImage = admin.image;
        const adminId = admin._id;

        let news = await new News({
            title,
            excerpt,
            content,
            category,
            image,
            author: adminName,
            authorImage: adminImage,
            authorId: adminId
        });
        news = await news.save();
        if (!news) return res.status(500).json({ message: "error adding news post" })
        res.status(201).json({ message: "news post added successfully", news })
    },

    getSingleNews: async (req, res, next) => {
        const { newsId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(newsId)) return res.status(400).json({ message: "Invalid ID" });

        let news = await News.findById(newsId).select("-authorId");
        if (!news) return res.status(400).json({ message: "news post with such ID is unavailable" });

        //increase news views by 1
        news.views += 1;
        news = await news.save();

        res.json({ news });
    },

    editNews: async (req, res, next) => {
        const { newsId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(newsId)) return res.status(400).json({ message: "Invalid ID" });


        const news = await News.findById(newsId);
        if (!news) return res.status(400).json({ message: "news post with such ID is unavailable" });

        // check if post was added by this admin
        if (news.authorId.toString() !== req.user._id.toString()) return res.status(401).json({ message: "Unauthorize: Not allowed to delete this post " })

        const { error, value } = validateNews(req.body)
        if (error) return res.status(400).json({ message: error.details[0].message });
        const { title, excerpt, content, category } = value;
        news.title = title;
        news.excerpt = excerpt;
        news.content = content;
        news.category = category;

        //if image entry is entered
        if (req.file) {
            //delte existing image and add new image
            delteImage(news.image);
            news.image = req.file.path;
        }

        const updatedNews = await news.save();
        if (!updatedNews) return res.status(500).json({ message: "error updating news post" })
        res.json({ message: "News updated sucessfully", news: updatedNews })
    },

    deleteNews: async (req, res, next) => {
        const { newsId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(newsId)) return res.status(400).json({ message: "Invalid ID" });

        const news = await News.findById(newsId);
        if (!news) return res.status(400).json({ message: "news post with such ID is unavailable" });

        // check if post was added by this admin
        if (news.authorId.toString() !== req.user._id.toString()) return res.status(401).json({ message: "Unauthorize: Not allowed to delete this post " })

        const deletedNews = await (await News.findByIdAndDelete({ _id: newsId })).select("-__v -authorId");
        if (!deletedNews) return res.status(500).json({ message: "error deleting news post" })

        //delete existing image
        deleteImage(deletedNews.image);

        res.json({ message: "news deleted successfully", news: deletedNews });
    }
}