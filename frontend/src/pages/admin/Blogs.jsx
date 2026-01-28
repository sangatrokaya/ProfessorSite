import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import api from "@/services/api";
import { toast } from "react-toastify";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BookOpen,
  Plus,
  Pencil,
  Trash2,
  Tag,
  Eye,
  EyeOff,
  Calendar,
  Search,
  Loader2,
  ExternalLink,
} from "lucide-react";

const Blogs = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all, published, draft

  // Get admin token
  const { adminInfo } = useSelector((state) => state.auth);
  const token = adminInfo?.token;

  /* FETCH BLOGS */
  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/api/blogs/admin");
      setBlogs(data);
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
      toast.error("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  /* DELETE */
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;

    try {
      setLoading(true);
      await api.delete(`/api/blogs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Blog deleted successfully!");
      await fetchBlogs();
    } catch (error) {
      console.error("Failed to delete blog:", error);
      toast.error("Failed to delete blog");
    } finally {
      setLoading(false);
    }
  };

  /* TOGGLE PUBLISH STATUS */
  const togglePublishStatus = async (blog) => {
    try {
      setLoading(true);
      await api.put(
        `/api/blogs/${blog._id}`,
        { ...blog, published: !blog.published },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      toast.success(
        `Blog ${!blog.published ? "published" : "unpublished"} successfully!`,
      );
      await fetchBlogs();
    } catch (error) {
      console.error("Failed to toggle publish status:", error);
      toast.error("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  /* FILTER BLOGS */
  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (Array.isArray(blog.tags) &&
        blog.tags.some((tag) =>
          tag?.toLowerCase().includes(searchQuery.toLowerCase()),
        ));

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "published" && blog.published) ||
      (filterStatus === "draft" && !blog.published);

    return matchesSearch && matchesStatus;
  });

  /* LOADING SKELETON */
  const BlogSkeleton = () => (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-20 w-full" />
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-primary" />
            Blog Management
          </h2>
          <p className="text-muted-foreground mt-1">
            Create, edit, and manage your blog posts
          </p>
        </div>

        <Button size="lg" onClick={() => navigate("/admin/blogs/new")}>
          <Plus className="w-4 h-4 mr-2" />
          New Blog Post
        </Button>
      </div>

      {/* Search & Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search blogs by title, content, or tags..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <div className="relative min-w-[180px]">
              <select
                className="w-full h-10 px-3 border rounded-md bg-background"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Blogs</option>
                <option value="published">Published</option>
                <option value="draft">Drafts</option>
              </select>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mt-4">
            Showing {filteredBlogs.length} of {blogs.length} blogs
          </p>
        </CardContent>
      </Card>

      {/* Blogs List */}
      {loading && blogs.length === 0 ? (
        <div className="grid gap-4">
          <BlogSkeleton />
          <BlogSkeleton />
          <BlogSkeleton />
        </div>
      ) : filteredBlogs.length === 0 ? (
        <Card className="border-2 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full mb-4">
              <BookOpen className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No blogs found</h3>
            <p className="text-sm text-muted-foreground text-center max-w-sm mb-4">
              {searchQuery || filterStatus !== "all"
                ? "Try adjusting your search or filter"
                : "Get started by creating your first blog post"}
            </p>
            {!searchQuery && filterStatus === "all" && (
              <Button onClick={() => navigate("/admin/blogs/new")}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Blog
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredBlogs.map((blog) => (
            <Card
              key={blog._id}
              className="group hover:shadow-lg transition-all duration-300 border-2"
            >
              <div className="flex flex-col md:flex-row gap-4">
                {/* Blog Image */}
                {blog.image && (
                  <div className="md:w-48 h-48 md:h-auto flex-shrink-0">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-full object-cover md:rounded-l-lg"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  </div>
                )}

                {/* Blog Content */}
                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">
                        {blog.title}
                      </CardTitle>

                      <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(blog.createdAt).toLocaleDateString()}
                        </div>

                        <Badge
                          variant={blog.published ? "default" : "secondary"}
                        >
                          {blog.published ? (
                            <>
                              <Eye className="w-3 h-3 mr-1" />
                              Published
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3 mr-1" />
                              Draft
                            </>
                          )}
                        </Badge>
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {blog.content}
                      </p>

                      {/* Tags */}
                      {blog.tags && blog.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {blog.tags.map((tag, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
                            >
                              <Tag className="w-2.5 h-2.5 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/admin/blogs/${blog._id}/edit`)}
                    >
                      <Pencil className="w-4 h-4 mr-2" />
                      Edit
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => togglePublishStatus(blog)}
                    >
                      {blog.published ? (
                        <>
                          <EyeOff className="w-4 h-4 mr-2" />
                          Unpublish
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4 mr-2" />
                          Publish
                        </>
                      )}
                    </Button>

                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/blogs/${blog._id}`} target="_blank">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View
                      </Link>
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(blog._id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Blogs;
