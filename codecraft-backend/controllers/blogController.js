const Blog = require("../models/Blog");
const cloudinary = require("../config/cloudinary");

// Create Blog
const createBlog = async (req, res) => {
  try {
    const { title, category, content } = req.body;

    if (!title || !category || !content) {
      return res.status(400).json({
        message: "Title, category and content are required"
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Blog image is required"
      });
    }

    const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString(
      "base64"
    )}`;

    const uploadResult = await cloudinary.uploader.upload(base64Image, {
      folder: "codecraft-blogs"
    });

    const blog = await Blog.create({
      title,
      category,
      content,
      image: uploadResult.secure_url,
      author: req.user._id
    });

    res.status(201).json({
      message: "Blog published successfully",
      blog
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Get All Blogs
const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Blogs fetched successfully",
      blogs
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  createBlog,
  getBlogs
};