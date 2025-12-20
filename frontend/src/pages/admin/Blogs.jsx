import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "@/services/api";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const { adminInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchBlogs = async () => {
      const { data } = await api.get("/api/blogs/admin", {
        headers: {
          Authorization: `Bearer ${adminInfo.token}`,
        },
      });
      setBlogs(data);
    };
    fetchBlogs();
  }, [adminInfo]);

  console.log("adminInfo:", adminInfo);

  const addBlogHandler = async () => {
    await api.post(
      "/api/blogs",
      {
        title: "Sample Blog",
        content: "Blog content goes here",
        published: true,
      },
      {
        headers: {
          Authorization: `Bearer ${adminInfo.token}`,
        },
      }
    );
    window.location.reload();
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Blogs</h2>

      <button
        className="bg-black text-white px-4 py-2 mb-4"
        onClick={addBlogHandler}
      >
        Add Blog
      </button>

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
    </div>
  );
};

export default Blogs;
