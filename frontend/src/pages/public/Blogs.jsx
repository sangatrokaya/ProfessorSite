import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "@/services/api";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data } = await api.get("/api/blogs");
        setBlogs(data);
      } catch (error) {
        console.error("Failed to fetch blogs", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (loading) {
    return <p>Loading blogs...</p>;
  }
  return (
    <div className="max-w-5xl mx-auto space-y-10">
      {/* PAGE HEADER */}
      <section>
        <h1 className="text-3xl font-bold mb-2">Blogs</h1>
        <p className="text-gray-600">
          Thoughts, research insights, and academic writing.
        </p>
      </section>

      {/* BLOG LIST */}
      <section className="space-y-6">
        {blogs.length === 0 ? (
          <p className="text-gray-500">No blogs published yet!</p>
        ) : (
          blogs.map((blog) => (
            <div key={blog._id} className="border-b pb-4">
              <h2 className="text-xl font-semibold">
                <Link to={`/blogs/${blog._id}`} className="hover:underline">
                  {blog.title}
                </Link>
              </h2>

              <p className="text-sm text-gray-500">
                {new Date(blog.createdAt).toDateString()}
              </p>
            </div>
          ))
        )}
      </section>
    </div>
  );
};

export default Blogs;
