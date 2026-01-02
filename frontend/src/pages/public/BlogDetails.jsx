/* Single Blog Read Page */

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "@/services/api";

import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-4 w-40" />
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
    );
  }

  if (!blog) {
    return <p className="text-center text-gray-500">Blog not found!</p>;
  }

  return (
    <article className="max-w-3xl mx-auto space-y-8">
      {/* Back Link */}
      <Link to="/blogs">
        <Button variant="ghost" size="sm">
          ← Back to Blogs
        </Button>
      </Link>

      {/* Title */}
      <h1 className="text-4xl font-bold leading-tight">{blog.title}</h1>

      {/* Meta */}
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <Badge variant="secondary">Blog</Badge>
        <span className="text-sm text-gray-500">
          {new Date(blog.createdAt).toDateString()}
        </span>
      </div>

      {/* Divider */}
      <hr />

      {/* Content */}
      <div className="prose prose-lg prose-slate max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {blog.content}
        </ReactMarkdown>
      </div>
    </article>
  );
};

export default BlogDetails;
