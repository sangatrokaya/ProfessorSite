import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "@/services/api";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

// import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";

import { calculateReadingStats } from "@/utils/readingTime";
import SimpleEditor from "@/components/editor/SimpleEditor";

const BlogEditor = () => {
  const { id } = useParams(); // undefined for new blog
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    content: "",
    published: false,
  });

  const { wordCount, readingTime } = calculateReadingStats(form.content || "");

  /* ------------- FETCH BLOG (EDIT MODE) ---------------- */
  useEffect(() => {
    if (!isEditMode) return;

    const fetchBlog = async () => {
      try {
        const { data } = await api.get(`/api/blogs/${id}`);
        setForm({
          title: data.title || "",
          content: data.content || "",
          published: data.published || false,
        });
      } catch (error) {
        console.error("Failed to fetch blog!", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id, isEditMode]);

  /* --------- SAVE HANDLER ------------ */
  const submitHandler = async () => {
    try {
      setSaving(true);

      if (isEditMode) {
        await api.put(`/api/blogs/${id}`, form);
      } else {
        await api.post("/api/blogs", form);
      }
      navigate("/admin/blogs");
    } catch (error) {
      console.error("Save blog error: ", error);

      if (error.response) {
        console.error("Response data: ", error.response.data);
        console.error("Status: ", error.response.status);
        toast.error(error.response.data?.message || "Save filed");
      } else {
        toast.error("Network or server error");
      }
      // console.error("Failed to save blog!", error);
      // alert("Failed to save blog!");
    } finally {
      setSaving(false);
    }
  };

  /* ------------ DELETE BLOG HANDLER -------------- */
  const deleteBlogHandler = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this blog?  This action can't be undone."
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/api/blogs/${id}`);
      toast.success("Blog deleted successfully");
      navigate("/admin/blogs");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete blog!");
    }
  };

  /* ------------ LOADING STATE ---------------- */
  if (loading) {
    return (
      <div className="space-y-4 max-w-5xl">
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div
      className={`${
        fullscreen ? "fixed inset-0 z-50 bg-background overflow-auto" : ""
      }`}
    >
      <div className="max-w-6xl mx-auto space-y-6 px-4 py-6">
        {/* Sticky Toolbar */}
        <div className="sticky top-0 z-20 bg-background border-b">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            {/* Left */}
            <div>
              <h2 className="text-lg font-semibold">
                {isEditMode ? "Edit Blog" : "New Blog"}
              </h2>
              <p className="text-xs text-muted-foreground">
                {wordCount} words • {readingTime} min read
              </p>
            </div>

            {/* Right */}
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFullscreen((prev) => !prev)}
              >
                {fullscreen ? "Exit Fullscreen" : "Fullscreen"}
              </Button>
              <Link to="/admin/blogs">
                <Button variant="outline" size="sm">
                  ← Back
                </Button>
              </Link>
              <Button size="sm" onClick={submitHandler} disabled={saving}>
                {saving ? "Saving" : "Save"}
              </Button>
            </div>
          </div>
        </div>

        {/* Publish Toggle */}
        <div className="flex items-center gap-3">
          <Switch
            checked={form.published}
            onCheckedChange={(value) => setForm({ ...form, published: value })}
          />
          <Badge variant={form.published ? "default" : "secondary"}>
            {form.published ? "Published" : "Draft"}
          </Badge>
        </div>

        {/* Title */}
        <Input
          placeholder="Blog title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="text-3xl font-bold border-none px-0 focus-visible:ring-0"
        />

        {/* Editor + Preview */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Markdown Input */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Text Editor</p>
            {/* <Textarea
              rows={20}
              placeholder="Write your blog in Markdown..."
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="font-mono text-sm leading-relaxed focus-visible:ring-2"
            /> */}

            <SimpleEditor
              value={form.content}
              onChange={(html) => setForm({ ...form, content: html })}
            />
          </div>

          {/* Live Preview */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Preview</p>
            <div className="border rounded-lg p-4 prose max-w-none">
              {form.content ? (
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: form.content }}
                />
              ) : (
                <p className="text-muted-foreground">
                  Start typing to see preview...
                </p>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-between pt-6 border-t">
            <Button variant="outline" onClick={() => navigate("/admin/blogs")}>
              Cancel
            </Button>

            {isEditMode && (
              <Button
                variant="destructive"
                onClick={deleteBlogHandler}
                className="text-white"
              >
                Delete Blog
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogEditor;
