import Blog from "../models/Blog.js";

/* ------------------- PUBLIC ------------------------ */

// @desc Get all the blogs
// @route GET /api/blogs
// @access Public
export const getBlogs = async (req, res) => {
  const blogs = await Blog.find({ published: true }).sort({ createdAt: -1 });
  res.json(blogs);
};

// @desc Get single blog by ID
// @route GET /api/blogs/:id
// @access Public (or Admin if you prefer)
export const getBlogById = async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog || !blog.published) {
    return res.status(404).json({ message: "Blog not found!" });
  }
  res.json(blog); // allow drafts for admin editor
};

/* --------------------- ADMIN ------------------------ */

// @desc Get all blogs (Admin)
// @route GET /api/blogs/admin
// @access Admin
export const getAllBlogsAdmin = async (req, res) => {
  const blogs = await Blog.find().sort({ createdAt: -1 });
  res.json(blogs);
};

// @desc Create blog
// @route POST /api/blogs
// @access Admin
export const createBlog = async (req, res) => {
  try {
    const { title, content, tags, published } = req.body;

    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Title and content are required" });
    }
    const blog = new Blog({
      title,
      content,
      tags,
      published,
    });

    const createdBlog = await blog.save();
    res.status(201).json(createdBlog);
  } catch (error) {
    console.error("Create blog error: ", error);
    res.status(500).json({ message: "Failed to create blog" });
  }
};

// @desc Update blog
// @route PUT /api/blogs/:id
// @access Admin
export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found!" });
    }

    blog.title = req.body.title || blog.title;
    blog.content = req.body.content || blog.content;
    blog.published = req.body.published ?? blog.published;

    const updatedBlog = await blog.save();
    res.json(updatedBlog);
  } catch (error) {
    console.error("Update blog error: ", error);
    res.status(500).json({ message: "Failed to update blog!" });
  }
};

// @desc Delete blog
// @route DELETE /api/blogs/:id
// @access Admin
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found!" });
    }
    await blog.deleteOne();
    res.json({ message: "Blog removed successfully..." });
  } catch (error) {
    console.error("Delete blog error: ", error);
    res.status(500).json({ message: "Failed to delete blog!" });
  }
};
