import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "@/services/api";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BookOpen,
  Calendar,
  Clock,
  Search,
  Tag,
  ArrowRight,
  FileText,
} from "lucide-react";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState(null);

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

  // Extract all unique tags from all blogs
  const allTags = [...new Set(blogs.flatMap((blog) => blog.tags || []))].filter(
    Boolean,
  );

  // Filter blogs based on search and selected tag
  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.content?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTag =
      !selectedTag ||
      (Array.isArray(blog.tags) && blog.tags.includes(selectedTag));

    return matchesSearch && matchesTag;
  });

  // Calculate reading time (approximate)
  const calculateReadingTime = (content) => {
    const wordsPerMinute = 200;
    const wordCount = content?.split(/\s+/).length || 0;
    return Math.ceil(wordCount / wordsPerMinute) || 1;
  };

  // Loading skeleton
  const BlogSkeleton = () => (
    <Card>
      <div className="flex flex-col md:flex-row gap-6">
        <Skeleton className="w-full md:w-64 h-48" />
        <div className="flex-1 p-6 space-y-3">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-b">
        {/* Decorative Elements */}
        <div className="absolute inset-0 bg-grid-slate-200 dark:bg-grid-slate-800 [mask-image:linear-gradient(0deg,transparent,black)] opacity-20" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full blur-3xl opacity-10" />

        <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <Badge variant="secondary" className="text-sm">
                Blog & Insights
              </Badge>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-br from-slate-900 via-slate-800 to-slate-600 dark:from-white dark:via-slate-200 dark:to-slate-400 bg-clip-text text-transparent mb-4">
              Blogs
            </h1>

            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
              Thoughts, research insights, and academic writing exploring the
              intersections of technology, education, and innovation.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 dark:bg-blue-950 rounded-lg">
                  <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{blogs.length}</div>
                  <div className="text-xs text-muted-foreground">
                    Blog Posts
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-100 dark:bg-purple-950 rounded-lg">
                  <Tag className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{allTags.length}</div>
                  <div className="text-xs text-muted-foreground">Topics</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        {/* Search & Filter */}
        <Card className="mb-8 border-2">
          <CardContent className="pt-6 space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search blogs by title or content..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Tag Filter */}
            {allTags.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Filter by Topic
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedTag === null ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTag(null)}
                  >
                    All Topics
                  </Button>
                  {allTags.map((tag) => (
                    <Button
                      key={tag}
                      variant={selectedTag === tag ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedTag(tag)}
                    >
                      {tag}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="text-sm text-muted-foreground">
              Showing {filteredBlogs.length} of {blogs.length} blogs
            </div>
          </CardContent>
        </Card>

        {/* Blog List */}
        <div className="space-y-6">
          {loading ? (
            // Loading skeletons
            <>
              <BlogSkeleton />
              <BlogSkeleton />
              <BlogSkeleton />
            </>
          ) : filteredBlogs.length === 0 ? (
            // Empty state
            <Card className="border-2 border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full mb-4">
                  <BookOpen className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No blogs found</h3>
                <p className="text-sm text-muted-foreground text-center max-w-sm">
                  {searchQuery || selectedTag
                    ? "Try adjusting your search or filter"
                    : "No blogs have been published yet. Check back soon!"}
                </p>
              </CardContent>
            </Card>
          ) : (
            // Blog cards
            filteredBlogs.map((blog) => (
              <Link key={blog._id} to={`/blogs/${blog._id}`}>
                <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/20 overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    {/* Blog Image */}
                    {blog.image ? (
                      <div className="md:w-64 h-48 md:h-auto flex-shrink-0 overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800">
                        <img
                          src={blog.image}
                          alt={blog.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      </div>
                    ) : (
                      <div className="hidden md:flex md:w-64 h-48 md:h-auto flex-shrink-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 items-center justify-center">
                        <BookOpen className="w-16 h-16 text-slate-300 dark:text-slate-700" />
                      </div>
                    )}

                    {/* Blog Content */}
                    <CardHeader className="flex-1">
                      <div className="space-y-4">
                        {/* Title */}
                        <h2 className="text-2xl font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">
                          {blog.title}
                        </h2>

                        {/* Meta Information */}
                        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>
                              {new Date(blog.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                },
                              )}
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>
                              {calculateReadingTime(blog.content)} min read
                            </span>
                          </div>
                        </div>

                        {/* Excerpt */}
                        {blog.content && (
                          <p className="text-muted-foreground line-clamp-3 leading-relaxed">
                            {blog.content
                              .replace(/<[^>]*>/g, "")
                              .substring(0, 200)}
                            ...
                          </p>
                        )}

                        {/* Tags */}
                        {blog.tags && blog.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {blog.tags.slice(0, 3).map((tag, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs"
                              >
                                <Tag className="w-2.5 h-2.5 mr-1" />
                                {tag}
                              </Badge>
                            ))}
                            {blog.tags.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{blog.tags.length - 3} more
                              </Badge>
                            )}
                          </div>
                        )}

                        {/* Read More Link */}
                        <div className="flex items-center gap-2 text-primary font-medium group-hover:gap-3 transition-all">
                          <span>Read More</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </CardHeader>
                  </div>
                </Card>
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default Blogs;
