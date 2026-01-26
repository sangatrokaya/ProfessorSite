import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "@/services/api";
import { toast } from "react-toastify";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  GraduationCap,
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  Youtube,
  FileText,
  Image as ImageIcon,
  ExternalLink,
  Loader2,
  Search,
  Calendar,
  Link as LinkIcon,
} from "lucide-react";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingCourse, setEditingCourse] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    semester: "",
    image: "",
    youtubePlaylist: "",
    materials: [],
  });
  const [materialInput, setMaterialInput] = useState("");

  // Get admin token
  const { adminInfo } = useSelector((state) => state.auth);
  const token = adminInfo?.token;

  /* FETCH COURSES */
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/api/courses");
      setCourses(data);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  /* FORM HELPERS */
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      semester: "",
      image: "",
      youtubePlaylist: "",
      materials: [],
    });
    setMaterialInput("");
    setEditingCourse(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title || "",
      description: course.description || "",
      semester: course.semester || "",
      image: course.image || "",
      youtubePlaylist: course.youtubePlaylist || "",
      materials: Array.isArray(course.materials) ? [...course.materials] : [],
    });
    setMaterialInput("");
    setIsDialogOpen(true);
  };

  /* MATERIAL MANAGEMENT */
  const handleAddMaterial = () => {
    if (materialInput.trim()) {
      setFormData({
        ...formData,
        materials: [...formData.materials, materialInput.trim()],
      });
      setMaterialInput("");
    }
  };

  const handleRemoveMaterial = (index) => {
    setFormData({
      ...formData,
      materials: formData.materials.filter((_, i) => i !== index),
    });
  };

  /* SUBMIT (CREATE / UPDATE) */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }

    try {
      setLoading(true);

      const dataToSend = {
        title: formData.title,
        description: formData.description,
        semester: formData.semester,
        image: formData.image,
        youtubePlaylist: formData.youtubePlaylist,
        materials: formData.materials,
      };

      if (editingCourse) {
        await api.put(`/api/courses/${editingCourse._id}`, dataToSend);
        toast.success("Course updated successfully!");
      } else {
        await api.post("/api/courses", dataToSend);
        toast.success("Course added successfully!");
      }

      setIsDialogOpen(false);
      resetForm();
      await fetchCourses();
    } catch (error) {
      console.error("Failed to save course:", error);
      console.error("Error response:", error.response?.data);
      toast.error(error.response?.data?.message || "Failed to save course");
    } finally {
      setLoading(false);
    }
  };

  /* DELETE */
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this course?")) return;

    try {
      setLoading(true);
      await api.delete(`/api/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Course deleted successfully!");
      await fetchCourses();
    } catch (error) {
      console.error("Failed to delete course:", error);
      toast.error("Failed to delete course");
    } finally {
      setLoading(false);
    }
  };

  /* FILTER */
  const filteredCourses = courses.filter(
    (course) =>
      course.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.semester?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <GraduationCap className="w-8 h-8 text-primary" />
            Courses Management
          </h2>
          <p className="text-muted-foreground mt-1">
            Manage your teaching courses with YouTube playlists and materials
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" onClick={openCreateDialog}>
              <Plus className="w-4 h-4 mr-2" />
              Add New Course
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                {editingCourse ? "Edit Course" : "Add New Course"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Course Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Data Structures and Algorithms"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  rows={4}
                  placeholder="Brief description of the course content and objectives..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              {/* Semester */}
              <div className="space-y-2">
                <Label htmlFor="semester">Semester / Academic Period</Label>
                <Input
                  id="semester"
                  placeholder="e.g., Fall 2024, Spring 2025, Year 3 Semester 1"
                  value={formData.semester}
                  onChange={(e) =>
                    setFormData({ ...formData, semester: e.target.value })
                  }
                />
              </div>

              {/* Course Image */}
              <div className="space-y-2">
                <Label htmlFor="image">Course Image URL</Label>
                <div className="relative">
                  <ImageIcon className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="image"
                    type="url"
                    className="pl-10"
                    placeholder="https://example.com/course-image.jpg"
                    value={formData.image}
                    onChange={(e) =>
                      setFormData({ ...formData, image: e.target.value })
                    }
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Upload image to Cloudinary or similar service and paste URL
                  here
                </p>
                {formData.image && (
                  <div className="mt-2">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-full h-40 object-cover rounded-lg border"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  </div>
                )}
              </div>

              {/* YouTube Playlist */}
              <div className="space-y-2">
                <Label htmlFor="youtubePlaylist">YouTube Playlist URL</Label>
                <div className="relative">
                  <Youtube className="absolute left-3 top-3 w-4 h-4 text-red-600" />
                  <Input
                    id="youtubePlaylist"
                    type="url"
                    className="pl-10"
                    placeholder="https://www.youtube.com/playlist?list=..."
                    value={formData.youtubePlaylist}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        youtubePlaylist: e.target.value,
                      })
                    }
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Link to your YouTube playlist containing course lectures
                </p>
              </div>

              {/* Materials */}
              <div className="space-y-2">
                <Label>Course Materials (PDFs, Slides, etc.)</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Paste material link (PDF, slides, etc.)"
                    value={materialInput}
                    onChange={(e) => setMaterialInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddMaterial();
                      }
                    }}
                  />
                  <Button type="button" onClick={handleAddMaterial}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {/* Materials List */}
                {formData.materials.length > 0 && (
                  <div className="space-y-2 mt-3">
                    {formData.materials.map((material, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-900 rounded-lg"
                      >
                        <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <a
                          href={material}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm flex-1 truncate hover:text-primary"
                        >
                          {material}
                        </a>
                        <button
                          type="button"
                          onClick={() => handleRemoveMaterial(index)}
                          className="hover:bg-destructive/20 rounded-full p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {editingCourse ? "Update" : "Create"}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search courses by title, description, or semester..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {filteredCourses.length} of {courses.length} courses
          </p>
        </CardContent>
      </Card>

      {/* Courses List */}
      {loading && courses.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : filteredCourses.length === 0 ? (
        <Card className="border-2 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full mb-4">
              <GraduationCap className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No courses found</h3>
            <p className="text-sm text-muted-foreground text-center max-w-sm mb-4">
              {searchQuery
                ? "Try adjusting your search query"
                : "Get started by adding your first course"}
            </p>
            {!searchQuery && (
              <Button onClick={openCreateDialog}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Course
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredCourses.map((course) => (
            <Card
              key={course._id}
              className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 overflow-hidden"
            >
              {/* Course Image */}
              {course.image && (
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>
              )}

              <CardHeader>
                <div className="space-y-3">
                  {/* Title */}
                  <CardTitle className="text-xl leading-tight group-hover:text-primary transition-colors">
                    {course.title}
                  </CardTitle>

                  {/* Semester */}
                  {course.semester && (
                    <Badge variant="outline" className="w-fit">
                      <Calendar className="w-3 h-3 mr-1" />
                      {course.semester}
                    </Badge>
                  )}

                  {/* Description */}
                  {course.description && (
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {course.description}
                    </p>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                {/* YouTube Playlist Link */}
                {course.youtubePlaylist && (
                  <a
                    href={course.youtubePlaylist}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/30 rounded-lg hover:bg-red-100 dark:hover:bg-red-950/50 transition-colors"
                  >
                    <Youtube className="w-5 h-5 text-red-600" />
                    <span className="text-sm font-medium text-red-600">
                      Watch Lectures
                    </span>
                    <ExternalLink className="w-3 h-3 ml-auto text-red-600" />
                  </a>
                )}

                {/* Materials Count */}
                {course.materials && course.materials.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="w-4 h-4" />
                    <span>{course.materials.length} course materials</span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => openEditDialog(course)}
                  >
                    <Pencil className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(course._id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Courses;
