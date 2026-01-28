import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "@/services/api";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

import { calculateReadingStats } from "@/utils/readingTime";
import SimpleEditor from "@/components/editor/SimpleEditor";

import {
  ArrowLeft,
  Save,
  Eye,
  EyeOff,
  X,
  Plus,
  Image as ImageIcon,
  Tag,
  Loader2,
  Maximize2,
  Minimize2,
  Trash2,
  BookOpen,
  Clock,
  FileText,
} from "lucide-react";

const BlogEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    content: "",
    image: "",
    tags: [],
    published: false,
  });
  const [tagInput, setTagInput] = useState("");

  // Get admin token
  const { adminInfo } = useSelector((state) => state.auth);
  const token = adminInfo?.token;

  const { wordCount, readingTime } = calculateReadingStats(form.content || "");

  /* FETCH BLOG (EDIT MODE) */
  useEffect(() => {
    if (!isEditMode) return;

    const fetchBlog = async () => {
      try {
        const { data } = await api.get(`/api/blogs/${id}`);
        setForm({
          title: data.title || "",
          content: data.content || "",
          image: data.image || "",
          tags: Array.isArray(data.tags) ? [...data.tags] : [],
          published: data.published || false,
        });
      } catch (error) {
        console.error("Failed to fetch blog!", error);
        toast.error("Failed to load blog");
        navigate("/admin/blogs");
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id, isEditMode, navigate]);

  /* TAG MANAGEMENT */
  const handleAddTag = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      setForm({
        ...form,
        tags: [...form.tags, tagInput.trim()],
      });
      setTagInput("");
    }
  };

  const handleRemoveTag = (index) => {
    setForm({
      ...form,
      tags: form.tags.filter((_, i) => i !== index),
    });
  };

  /* SAVE HANDLER */
  const submitHandler = async () => {
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!form.content.trim()) {
      toast.error("Content is required");
      return;
    }

    try {
      setSaving(true);

      const dataToSend = {
        title: form.title,
        content: form.content,
        image: form.image,
        tags: form.tags,
        published: form.published,
      };

      if (isEditMode) {
        await api.put(`/api/blogs/${id}`, dataToSend, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Blog updated successfully!");
      } else {
        await api.post("/api/blogs", dataToSend, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Blog created successfully!");
      }

      navigate("/admin/blogs");
    } catch (error) {
      console.error("Save blog error:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        toast.error(error.response.data?.message || "Failed to save blog");
      } else {
        toast.error("Network or server error");
      }
    } finally {
      setSaving(false);
    }
  };

  /* DELETE BLOG HANDLER */
  const deleteBlogHandler = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this blog? This action can't be undone.",
      )
    )
      return;

    try {
      await api.delete(`/api/blogs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Blog deleted successfully");
      navigate("/admin/blogs");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete blog!");
    }
  };

  /* LOADING STATE */
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div
      className={`${
        fullscreen
          ? "fixed inset-0 z-50 bg-background overflow-auto"
          : "min-h-screen"
      }`}
    >
      <div className={`${fullscreen ? "py-0" : "max-w-7xl mx-auto px-4 py-6"}`}>
        {/* Sticky Toolbar */}
        <div
          className={`sticky top-0 z-20 bg-background/95 backdrop-blur border-b ${
            fullscreen ? "" : "rounded-t-lg"
          }`}
        >
          <div className="px-6 py-4 flex items-center justify-between">
            {/* Left */}
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                {isEditMode ? "Edit Blog Post" : "Create New Blog Post"}
              </h2>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                <div className="flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  {wordCount} words
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {readingTime} min read
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFullscreen((prev) => !prev)}
              >
                {fullscreen ? (
                  <>
                    <Minimize2 className="w-4 h-4 mr-2" />
                    Exit Fullscreen
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-4 h-4 mr-2" />
                    Fullscreen
                  </>
                )}
              </Button>

              <Link to="/admin/blogs">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>

              <Button size="sm" onClick={submitHandler} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className={`space-y-6 ${fullscreen ? "px-6 py-6" : "py-6"}`}>
          {/* Top Section - Title & Publish Status */}
          <div className="space-y-4">
            {/* Publish Toggle */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Switch
                      id="publish-toggle"
                      checked={form.published}
                      onCheckedChange={(value) =>
                        setForm({ ...form, published: value })
                      }
                    />
                    <Label
                      htmlFor="publish-toggle"
                      className="cursor-pointer flex items-center gap-2"
                    >
                      <span className="font-medium">Publication Status:</span>
                      <Badge
                        variant={form.published ? "default" : "secondary"}
                        className="gap-1"
                      >
                        {form.published ? (
                          <>
                            <Eye className="w-3 h-3" />
                            Published
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3" />
                            Draft
                          </>
                        )}
                      </Badge>
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Title */}
            <Card>
              <CardHeader>
                <CardTitle>Blog Title</CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  placeholder="Enter an engaging title for your blog post"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="text-2xl font-bold h-auto py-3"
                />
              </CardContent>
            </Card>

            {/* Featured Image */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  Featured Image
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <ImageIcon className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="url"
                    className="pl-10"
                    placeholder="https://example.com/image.jpg"
                    value={form.image}
                    onChange={(e) =>
                      setForm({ ...form, image: e.target.value })
                    }
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Upload image to Cloudinary or similar service and paste URL
                  here
                </p>
                {form.image && (
                  <div className="relative">
                    <img
                      src={form.image}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg border"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="w-5 h-5" />
                  Tags
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a tag (e.g., AI, Technology, Research)"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                  />
                  <Button type="button" onClick={handleAddTag}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add
                  </Button>
                </div>

                {/* Tags List */}
                {form.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {form.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="pl-3 pr-1 py-2 text-sm"
                      >
                        <Tag className="w-3 h-3 mr-1.5" />
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(index)}
                          className="ml-2 hover:bg-destructive/20 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Editor + Preview Section */}
          <Card>
            <CardHeader>
              <CardTitle>Content Editor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Editor */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Editor</Label>
                  <div className="border rounded-lg overflow-hidden">
                    <SimpleEditor
                      value={form.content}
                      onChange={(html) => setForm({ ...form, content: html })}
                    />
                  </div>
                </div>

                {/* Live Preview */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Live Preview</Label>
                  <div className="border rounded-lg p-6 min-h-[400px] bg-slate-50 dark:bg-slate-900">
                    {form.content ? (
                      <div
                        className="prose prose-slate dark:prose-invert max-w-none
                          [&>h1]:text-3xl [&>h1]:font-bold [&>h1]:mb-4
                          [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:mb-3
                          [&>h3]:text-xl [&>h3]:font-semibold [&>h3]:mb-2
                          [&>p]:text-base [&>p]:leading-relaxed [&>p]:mb-4
                          [&>ul]:mb-4 [&>ol]:mb-4
                          [&>blockquote]:border-l-4 [&>blockquote]:border-primary [&>blockquote]:pl-4 [&>blockquote]:italic
                          [&>pre]:bg-slate-900 [&>pre]:text-slate-100 [&>pre]:p-4 [&>pre]:rounded
                          [&>code]:bg-slate-200 dark:[&>code]:bg-slate-800 [&>code]:px-1 [&>code]:py-0.5 [&>code]:rounded
                          [&>img]:rounded-lg [&>img]:shadow-md
                          [&>a]:text-primary [&>a]:underline"
                        dangerouslySetInnerHTML={{ __html: form.content }}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        <div className="text-center">
                          <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                          <p>Start typing to see live preview...</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer Actions */}
          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="flex flex-wrap justify-between gap-4">
                <Button
                  variant="outline"
                  onClick={() => navigate("/admin/blogs")}
                  disabled={saving}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>

                <div className="flex gap-2">
                  {isEditMode && (
                    <Button
                      variant="destructive"
                      onClick={deleteBlogHandler}
                      disabled={saving}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Blog
                    </Button>
                  )}

                  <Button onClick={submitHandler} disabled={saving} size="lg">
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        {form.published
                          ? isEditMode
                            ? "Update & Publish"
                            : "Create & Publish"
                          : isEditMode
                            ? "Update Draft"
                            : "Save as Draft"}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BlogEditor;

// import { useEffect, useState } from "react";
// import { useNavigate, useParams, Link } from "react-router-dom";
// import { toast } from "react-toastify";
// import api from "@/services/api";

// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Switch } from "@/components/ui/switch";

// // import ReactMarkdown from "react-markdown";
// // import remarkGfm from "remark-gfm";

// import { calculateReadingStats } from "@/utils/readingTime";
// import SimpleEditor from "@/components/editor/SimpleEditor";

// const BlogEditor = () => {
//   const { id } = useParams(); // undefined for new blog
//   const navigate = useNavigate();
//   const isEditMode = Boolean(id);

//   const [loading, setLoading] = useState(isEditMode);
//   const [saving, setSaving] = useState(false);
//   const [fullscreen, setFullscreen] = useState(false);
//   const [form, setForm] = useState({
//     title: "",
//     content: "",
//     published: false,
//   });

//   const { wordCount, readingTime } = calculateReadingStats(form.content || "");

//   /* ------------- FETCH BLOG (EDIT MODE) ---------------- */
//   useEffect(() => {
//     if (!isEditMode) return;

//     const fetchBlog = async () => {
//       try {
//         const { data } = await api.get(`/api/blogs/${id}`);
//         setForm({
//           title: data.title || "",
//           content: data.content || "",
//           published: data.published || false,
//         });
//       } catch (error) {
//         console.error("Failed to fetch blog!", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchBlog();
//   }, [id, isEditMode]);

//   /* --------- SAVE HANDLER ------------ */
//   const submitHandler = async () => {
//     try {
//       setSaving(true);

//       if (isEditMode) {
//         await api.put(`/api/blogs/${id}`, form);
//       } else {
//         await api.post("/api/blogs", form);
//       }
//       navigate("/admin/blogs");
//     } catch (error) {
//       console.error("Save blog error: ", error);

//       if (error.response) {
//         console.error("Response data: ", error.response.data);
//         console.error("Status: ", error.response.status);
//         toast.error(error.response.data?.message || "Save filed");
//       } else {
//         toast.error("Network or server error");
//       }
//       // console.error("Failed to save blog!", error);
//       // alert("Failed to save blog!");
//     } finally {
//       setSaving(false);
//     }
//   };

//   /* ------------ DELETE BLOG HANDLER -------------- */
//   const deleteBlogHandler = async () => {
//     const confirmDelete = window.confirm(
//       "Are you sure you want to delete this blog?  This action can't be undone."
//     );

//     if (!confirmDelete) return;

//     try {
//       await api.delete(`/api/blogs/${id}`);
//       toast.success("Blog deleted successfully");
//       navigate("/admin/blogs");
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to delete blog!");
//     }
//   };

//   /* ------------ LOADING STATE ---------------- */
//   if (loading) {
//     return (
//       <div className="space-y-4 max-w-5xl">
//         <Skeleton className="h-10 w-1/2" />
//         <Skeleton className="h-64 w-full" />
//       </div>
//     );
//   }

//   return (
//     <div
//       className={`${
//         fullscreen ? "fixed inset-0 z-50 bg-background overflow-auto" : ""
//       }`}
//     >
//       <div className="max-w-6xl mx-auto space-y-6 px-4 py-6">
//         {/* Sticky Toolbar */}
//         <div className="sticky top-0 z-20 bg-background border-b">
//           <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
//             {/* Left */}
//             <div>
//               <h2 className="text-lg font-semibold">
//                 {isEditMode ? "Edit Blog" : "New Blog"}
//               </h2>
//               <p className="text-xs text-muted-foreground">
//                 {wordCount} words • {readingTime} min read
//               </p>
//             </div>

//             {/* Right */}
//             <div className="flex gap-2">
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={() => setFullscreen((prev) => !prev)}
//               >
//                 {fullscreen ? "Exit Fullscreen" : "Fullscreen"}
//               </Button>
//               <Link to="/admin/blogs">
//                 <Button variant="outline" size="sm">
//                   ← Back
//                 </Button>
//               </Link>
//               <Button size="sm" onClick={submitHandler} disabled={saving}>
//                 {saving ? "Saving" : "Save"}
//               </Button>
//             </div>
//           </div>
//         </div>

//         {/* Publish Toggle */}
//         <div className="flex items-center gap-3">
//           <Switch
//             checked={form.published}
//             onCheckedChange={(value) => setForm({ ...form, published: value })}
//           />
//           <Badge variant={form.published ? "default" : "secondary"}>
//             {form.published ? "Published" : "Draft"}
//           </Badge>
//         </div>

//         {/* Title */}
//         <Input
//           placeholder="Blog title"
//           value={form.title}
//           onChange={(e) => setForm({ ...form, title: e.target.value })}
//           className="text-3xl font-bold border-none px-0 focus-visible:ring-0"
//         />

//         {/* Editor + Preview */}
//         <div className="grid md:grid-cols-2 gap-6">
//           {/* Markdown Input */}
//           <div className="space-y-2">
//             <p className="text-sm font-medium">Text Editor</p>
//             {/* <Textarea
//               rows={20}
//               placeholder="Write your blog in Markdown..."
//               value={form.content}
//               onChange={(e) => setForm({ ...form, content: e.target.value })}
//               className="font-mono text-sm leading-relaxed focus-visible:ring-2"
//             /> */}

//             <SimpleEditor
//               value={form.content}
//               onChange={(html) => setForm({ ...form, content: html })}
//             />
//           </div>

//           {/* Live Preview */}
//           <div className="space-y-2">
//             <p className="text-sm font-medium">Preview</p>
//             <div className="border rounded-lg p-4 prose max-w-none">
//               {form.content ? (
//                 <div
//                   className="prose max-w-none"
//                   dangerouslySetInnerHTML={{ __html: form.content }}
//                 />
//               ) : (
//                 <p className="text-muted-foreground">
//                   Start typing to see preview...
//                 </p>
//               )}
//             </div>
//           </div>

//           {/* Footer Actions */}
//           <div className="flex justify-between pt-6 border-t">
//             <Button variant="outline" onClick={() => navigate("/admin/blogs")}>
//               Cancel
//             </Button>

//             {isEditMode && (
//               <Button
//                 variant="destructive"
//                 onClick={deleteBlogHandler}
//                 className="text-white"
//               >
//                 Delete Blog
//               </Button>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BlogEditor;
