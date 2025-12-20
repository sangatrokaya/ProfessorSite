import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "@/services/api";

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const blogsRes = await api.get("/api/blogs");
      const videosRes = await api.get("/api/videos");

      setBlogs(blogsRes.data.slice(0, 3));
      setVideos(videosRes.data.slice(0, 3));
    };

    fetchData();
  }, []);
  return (
    <div className="space-y-20">
      {/* HERO */}
      <section className="text-center py-20 bg-gray-50 rounded-lg">
        <h1 className="text-4xl font-bold mb-4">Asst. Prof. Bhim Rokaya</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Teacher • Researcher • Educator
        </p>
        <p className="text-sm text-gray-500 max-w-2xl mx-auto italic">
          Exploring knowledge through teaching, research, and publications
        </p>
      </section>

      {/* BLOGS */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Latest Blogs</h2>
          <Link to="/blogs" className="text-sm underline">
            View all
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <div key={blog._id} className="border p-4 rounded">
              <h3 className="font-semibold mb-2">{blog.title}</h3>
              <p className="text-sm text-gray-600">{blog.content}</p>
            </div>
          ))}
        </div>
      </section>

      {/* VIDEOS */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Latest Videos</h2>
          <Link to="/videos" className="text-sm underline">
            View all
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div key={video._id} className="border p-4 rounded">
              <h3 className="font-semibold mb-2">{video.title}</h3>
              <p className="text-sm text-gray-600 capitalize">
                {video.platform}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
