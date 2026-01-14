import { useEffect, useState } from "react";
import api from "@/services/api";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all blogs (admin)
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
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
  // const addBlogHandler = async () => {
  //   try {
  //     setLoading(true);

  //     const { data: newBlog } = await api.post("/api/blogs", {
  //       title: "Sample Blog",
  //       content: "Blog content goes here",
  //       published: true,
  //     });

  //     // Update local store instead of reloading
  //     setBlogs((prevBlogs) => [newBlog, ...prevBlogs]);
  //   } catch (error) {
  //     console.error("Failed to add blog:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Blogs</h2>

        <Link to="/admin/blogs/new">
          <Button>New Blogs</Button>
        </Link>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      ) : blogs.length === 0 ? (
        <p className="text-muted-foreground">No blogs created yet.</p>
      ) : (
        <ul className="space-y-3">
          {blogs.map((blog) => (
            <li
              key={blog._id}
              className="flex justify-between items-center border rounded-lg bg-white p-4 shadow"
            >
              <div>
                <p className="font-semibold">{blog.title}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(blog.createdAt).toDateString()}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Badge variant={blog.published ? "default" : "secondary"}>
                  {blog.published ? "Published" : "Draft"}
                </Badge>

                <Link to={`/admin/blogs/${blog._id}/edit`}>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}

      <button
        className={`px-4 py-2 mb-4 text-white ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-black"
        }`}
        disabled={loading}
      >
        {loading ? "Processing..." : "Add Blog"}
      </button>
    </div>
  );
};

export default Blogs;
