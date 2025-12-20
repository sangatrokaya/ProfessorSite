import Blog from "../models/Blog.js";

// @desc Get all the blogs
// @route GET /api/blogs
// @access Public
export const getBlogs = async (req, res) => {
  const blogs = await Blog.find({ published: true }).sort({ createdAt: -1 });
  res.json(blogs);
};

// @desc Get all blogs (Admin)
// @route GET /api/blogs
// @access Admin
export const getAllBlogsAdmin = async (req, res) => {
  const blogs = await Blog.find().sort({ createdAt: -1 });
  res.json(blogs);
};

// @desc Create blog
// @route POST /api/blogs
// @access Admin
export const createBlog = async (req, res) => {
  const { title, content, tags, published } = req.body;

  const blog = new Blog({
    title,
    content,
    tags,
    published,
  });

  const createdBlog = await blog.save();
  res.status(201).json(createdBlog);
};

// @desc Delete blog
// @route DELETE /api/blogs/:id
// @access Admin
export const deleteBlog = async (req, res) => {
  const blog = await Blog.findById(req.paramas.id);

  if (blog) {
    await blog.deleteOne();
    res.json({ message: "Blog removed successfully..." });
  } else {
    res.status(404).json({ message: "Blog not found!" });
  }
};
