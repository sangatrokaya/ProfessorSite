/* Single Blog Read Page */

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "@/services/api";

const BlogDetails = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const { data } = await api.get(`/api/blogs/${id}`);
        setBlog(data);
      } catch (error) {
        console.error("Failed to fetch blog!", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  if (loading) {
    return <p>Loading blog...</p>;
  }

  if (!blog) {
    return <p>Blog not found!</p>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">{blog.title}</h1>

      <p className="text-sm text-gray-500">
        {new Date(blog.createdAt).toDateString()}
      </p>

      <div className="prose max-w-none">{blog.content}</div>
    </div>
  );
};

export default BlogDetails;
