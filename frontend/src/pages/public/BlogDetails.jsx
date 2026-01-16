/* Single Blog Read Page */

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "@/services/api";

import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { calculateReadingStats } from "@/utils/readingTime";
import AuthorCard from "@/components/AuthorCard";

const BlogDetails = () => {
  const { id } = useParams();

  const [blog, setBlog] = useState();
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);

  const { wordCount, readingTime } = blog
    ? calculateReadingStats(blog.content)
    : { wordCount: 0, readingTime: 0 };

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const { data } = await api.get(`/api/blogs/${id}`);
        setBlog(data);
      } catch (error) {
        console.error("Failed to fetch blog!", error);
      } finally {
        setLoading(false); // Loading depends on blog
      }
    };

    const fetchAuthor = async () => {
      try {
        const { data } = await api.get("/api/profile");
        setAuthor(data);
      } catch (error) {
        console.log("Failed to fetch author info!", error);
      }
    };
    fetchBlog();
    fetchAuthor();
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
        <div className="flex items-center gap-1 text-sm text-gray-500">
          <span>{new Date(blog.createdAt).toDateString()}</span>
          <span>•</span>
          <span>{readingTime} min read</span>
          <span>•</span>
          <span>{wordCount} words</span>
        </div>
      </div>

      {/* Author Card */}
      <AuthorCard author={author} />

      {/* Divider */}
      <hr />

      {/* Content */}
      <div
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />
    </article>
  );
};

export default BlogDetails;
