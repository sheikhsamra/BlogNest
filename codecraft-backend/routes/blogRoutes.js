const express = require("express");
const router = express.Router();

const { createBlog, getBlogs } = require("../controllers/blogController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// Public route
router.get("/", getBlogs);

// Protected route with image upload
router.post("/", protect, upload.single("image"), createBlog);

module.exports = router;