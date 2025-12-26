import { useEffect, useState } from "react";
import api from "@/services/api";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all blogs (admin)
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/api/blogs/admin");
        setBlogs(data);
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  // Add blog
  const addBlogHandler = async () => {
    try {
      setLoading(true);

      const { data: newBlog } = await api.post("/api/blogs", {
        title: "Sample Blog",
        content: "Blog content goes here",
        published: true,
      });

      // Update local store instead of reloading
      setBlogs((prevBlogs) => [newBlog, ...prevBlogs]);
    } catch (error) {
      console.error("Failed to add blog:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Blogs</h2>

      <button
        className={`px-4 py-2 mb-4 text-white ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-black"
        }`}
        onClick={addBlogHandler}
        disabled={loading}
      >
        {loading ? "Processing..." : "Add Blog"}
      </button>

      {loading && blogs.length === 0 ? (
        <p>Loading blogs...</p>
      ) : (
        <ul className="space-y-2">
          {blogs.map((blog) => (
            <li key={blog._id} className="bg-white p-3 shadow">
              <p className="font-semibold">{blog.title}</p>
              <p className="text-sm text-gray-600">
                {blog.published ? "Published" : "Draft"}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Blogs;
