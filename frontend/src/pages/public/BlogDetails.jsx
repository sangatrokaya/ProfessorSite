import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "@/services/api";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { calculateReadingStats } from "@/utils/readingTime";
import AuthorCard from "@/components/AuthorCard";

import {
  ArrowLeft,
  Calendar,
  Clock,
  BookOpen,
  Tag,
  Share2,
  Eye,
} from "lucide-react";

const BlogDetails = () => {
  const { id } = useParams();

  const [blog, setBlog] = useState(null);
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
        setLoading(false);
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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog.title,
          text: blog.content.substring(0, 100) + "...",
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <Skeleton className="h-8 w-32 mb-8" />
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-8" />
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Blog not found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              The blog post you're looking for doesn't exist or has been
              removed.
            </p>
            <Button asChild>
              <Link to="/blogs">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blogs
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-b">
        {/* Decorative Elements */}
        <div className="absolute inset-0 bg-grid-slate-200 dark:bg-grid-slate-800 [mask-image:linear-gradient(0deg,transparent,black)] opacity-20" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full blur-3xl opacity-10" />

        <div className="relative max-w-4xl mx-auto px-4 py-12 md:py-16">
          {/* Back Button */}
          <Link to="/blogs">
            <Button variant="ghost" size="sm" className="mb-8 -ml-2">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blogs
            </Button>
          </Link>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-600 dark:from-white dark:via-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
            {blog.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <Calendar className="w-4 h-4" />
              <span>
                {new Date(blog.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <Clock className="w-4 h-4" />
              <span>{readingTime} min read</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <BookOpen className="w-4 h-4" />
              <span>{wordCount} words</span>
            </div>

            {blog.published && (
              <Badge variant="secondary" className="gap-1">
                <Eye className="w-3 h-3" />
                Published
              </Badge>
            )}
          </div>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="gap-1">
                  <Tag className="w-3 h-3" />
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Main Content */}
      <article className="max-w-4xl mx-auto px-4 py-12">
        {/* Featured Image */}
        {blog.image && (
          <div className="mb-12 rounded-xl overflow-hidden shadow-2xl">
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-auto object-cover"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>
        )}

        {/* Author Card */}
        {author && (
          <Card className="mb-12 border-2">
            <CardContent className="pt-6">
              <AuthorCard author={author} />
            </CardContent>
          </Card>
        )}

        {/* Share Button */}
        <div className="mb-8 flex justify-end">
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="w-4 h-4 mr-2" />
            Share Article
          </Button>
        </div>

        {/* Divider */}
        <hr className="mb-12 border-slate-200 dark:border-slate-800" />

        {/* Blog Content */}
        <div className="prose prose-lg prose-slate dark:prose-invert max-w-none">
          <div
            className="
              [&>h1]:text-4xl [&>h1]:font-bold [&>h1]:mb-6 [&>h1]:mt-12
              [&>h2]:text-3xl [&>h2]:font-bold [&>h2]:mb-4 [&>h2]:mt-10
              [&>h3]:text-2xl [&>h3]:font-semibold [&>h3]:mb-3 [&>h3]:mt-8
              [&>h4]:text-xl [&>h4]:font-semibold [&>h4]:mb-2 [&>h4]:mt-6
              [&>p]:text-lg [&>p]:leading-relaxed [&>p]:mb-6 [&>p]:text-slate-700 dark:[&>p]:text-slate-300
              [&>ul]:mb-6 [&>ul]:ml-6 [&>ul>li]:mb-2
              [&>ol]:mb-6 [&>ol]:ml-6 [&>ol>li]:mb-2
              [&>blockquote]:border-l-4 [&>blockquote]:border-primary [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:my-6
              [&>pre]:bg-slate-900 [&>pre]:text-slate-100 [&>pre]:p-4 [&>pre]:rounded-lg [&>pre]:overflow-x-auto [&>pre]:mb-6
              [&>code]:bg-slate-100 dark:[&>code]:bg-slate-800 [&>code]:px-2 [&>code]:py-1 [&>code]:rounded [&>code]:text-sm
              [&>img]:rounded-lg [&>img]:shadow-lg [&>img]:my-8
              [&>a]:text-primary [&>a]:underline [&>a]:font-medium
              [&>hr]:my-12 [&>hr]:border-slate-200 dark:[&>hr]:border-slate-800
            "
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>

        {/* Bottom Actions */}
        <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800">
          <div className="flex flex-wrap gap-4 justify-between items-center">
            <Link to="/blogs">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to All Blogs
              </Button>
            </Link>

            <Button variant="outline" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-2" />
              Share Article
            </Button>
          </div>
        </div>

        {/* Related Tags Section */}
        {blog.tags && blog.tags.length > 0 && (
          <Card className="mt-12 border-2">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Tag className="w-5 h-5 text-primary" />
                Topics Covered
              </h3>
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="px-3 py-1.5 text-sm"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </article>
    </div>
  );
};

export default BlogDetails;

// /* Single Blog Read Page */

// import { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import api from "@/services/api";

// import { Skeleton } from "@/components/ui/skeleton";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";

// import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";

// import { calculateReadingStats } from "@/utils/readingTime";
// import AuthorCard from "@/components/AuthorCard";

// const BlogDetails = () => {
//   const { id } = useParams();

//   const [blog, setBlog] = useState();
//   const [author, setAuthor] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const { wordCount, readingTime } = blog
//     ? calculateReadingStats(blog.content)
//     : { wordCount: 0, readingTime: 0 };

//   useEffect(() => {
//     const fetchBlog = async () => {
//       try {
//         const { data } = await api.get(`/api/blogs/${id}`);
//         setBlog(data);
//       } catch (error) {
//         console.error("Failed to fetch blog!", error);
//       } finally {
//         setLoading(false); // Loading depends on blog
//       }
//     };

//     const fetchAuthor = async () => {
//       try {
//         const { data } = await api.get("/api/profile");
//         setAuthor(data);
//       } catch (error) {
//         console.log("Failed to fetch author info!", error);
//       }
//     };
//     fetchBlog();
//     fetchAuthor();
//   }, [id]);

//   if (loading) {
//     return (
//       <div className="max-w-3xl mx-auto space-y-6">
//         <Skeleton className="h-10 w-3/4" />
//         <Skeleton className="h-4 w-40" />
//         <div className="space-y-3">
//           <Skeleton className="h-4 w-full" />
//           <Skeleton className="h-4 w-full" />
//           <Skeleton className="h-4 w-5/6" />
//         </div>
//       </div>
//     );
//   }

//   if (!blog) {
//     return <p className="text-center text-gray-500">Blog not found!</p>;
//   }

//   return (
//     <article className="max-w-3xl mx-auto space-y-8">
//       {/* Back Link */}
//       <Link to="/blogs">
//         <Button variant="ghost" size="sm">
//           ← Back to Blogs
//         </Button>
//       </Link>

//       {/* Title */}
//       <h1 className="text-4xl font-bold leading-tight">{blog.title}</h1>

//       {/* Meta */}
//       <div className="flex items-center gap-3 text-sm text-muted-foreground">
//         <Badge variant="secondary">Blog</Badge>
//         <div className="flex items-center gap-1 text-sm text-gray-500">
//           <span>{new Date(blog.createdAt).toDateString()}</span>
//           <span>•</span>
//           <span>{readingTime} min read</span>
//           <span>•</span>
//           <span>{wordCount} words</span>
//         </div>
//       </div>

//       {/* Author Card */}
//       <AuthorCard author={author} />

//       {/* Divider */}
//       <hr />

//       {/* Content */}
//       <div
//         className="prose prose-lg max-w-none"
//         dangerouslySetInnerHTML={{ __html: blog.content }}
//       />
//     </article>
//   );
// };

// export default BlogDetails;
