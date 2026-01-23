import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "@/services/api";

import { toast } from "react-toastify";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
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
  FileText,
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  Users,
  BookOpen,
  Calendar,
  ExternalLink,
  Loader2,
  Search,
} from "lucide-react";

const Papers = () => {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingPaper, setEditingPaper] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    authors: [],
    journal: "",
    year: "",
    link: "",
  });
  const [authorInput, setAuthorInput] = useState("");

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/api/papers");
        setPapers(data);
      } catch (error) {
        console.error("Failed to fetch papers: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPapers();
  }, []);

  const resetForm = () => {
    setFormData({
      title: "",
      authors: [],
      journal: "",
      year: "",
      link: "",
    });
    setAuthorInput("");
    setEditingPaper(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (paper) => {
    setEditingPaper(paper);
    setFormData({
      title: paper.title || "",
      authors: Array.isArray(paper.authors) ? [...paper.authors] : [], // Safety clone array
      journal: paper.journal || "",
      year: paper.year ? paper.year.toString() : "", // Convert to string for input
      link: paper.link || "",
    });
    setAuthorInput(""); // Clear the author input field
    setIsDialogOpen(true);
  };

  const handleAddAuthor = () => {
    if (authorInput.trim()) {
      setFormData({
        ...formData,
        authors: [...formData.authors, authorInput.trim()],
      });
      setAuthorInput("");
    }
  };

  const handleRemoveAuthor = (index) => {
    setFormData({
      ...formData,
      authors: formData.authors.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (formData.authors.length === 0) {
      toast.error("At least one author is required");
      return;
    }

    try {
      setLoading(true);

      // Prepare the data to send
      const dataToSend = {
        title: formData.title,
        authors: formData.authors,
        journal: formData.journal,
        year: formData.year ? parseInt(formData.year) : undefined,
        link: formData.link,
      };

      if (editingPaper) {
        const paperId = editingPaper._id;

        // Important: clear editing reference first
        setEditingPaper(null);

        // Update existing paper
        const { data } = await api.put(`/api/papers/${paperId}`, dataToSend);
        setPapers((prevPapers) =>
          prevPapers.map((p) => (p._id === data._id ? data : p)),
        );
        toast.success("Paper updated successfully!");
      } else {
        // Create new paper
        const { data } = await api.post("/api/papers", dataToSend);
        setPapers((prevPapers) => [data, ...prevPapers]);
        toast.success("Paper added successfully!");
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Failed to save paper: ", error);
      console.error("Error response: ", error.response?.data);
      toast.error(
        error.response?.data?.message ||
          "failed to save paper! Check console for details.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this paper?")) return;

    try {
      setLoading(true);
      await api.delete(`/api/papers/${id}`);
      setPapers((prevPapers) => prevPapers.filter((p) => p._id !== id));
      toast.success("Paper deleted successfully!");
    } catch (error) {
      console.error("Failed to delete paper: ", error);
      toast.error("Failed to delete paper");
    } finally {
      setLoading(false);
    }
  };

  // Filter papers
  const filteredPapers = papers.filter(
    (paper) =>
      paper.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (Array.isArray(paper.authors) &&
        paper.authors.some((author) =>
          author?.toLowerCase().includes(searchQuery.toLowerCase()),
        )) ||
      paper.journal?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <FileText className="w-8 h-8 text-primary" />
            Papers & Publications
          </h2>
          <p className="text-muted-foreground mt-1">
            Manage your research papers and academic publications
          </p>
        </div>

        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) setEditingPaper(null);
          }}
        >
          <DialogTrigger asChild>
            <Button size="lg" onClick={openCreateDialog}>
              <Plus className="w-4 h-4  mr-1" />
              Add New Paper
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                {editingPaper ? "Edit Paper" : "Add New Paper"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Paper Title *</Label>
                <Input
                  id="title"
                  placeholder="Enter the full title of the paper"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="text-muted-foreground"
                  required
                />
              </div>

              {/* Authors */}
              <div className="space-y-2">
                <Label>Authors *</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add author name"
                    value={authorInput}
                    onChange={(e) => setAuthorInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddAuthor();
                      }
                    }}
                    className="text-muted-foreground"
                  />
                  <Button type="button" onClick={handleAddAuthor}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {/* Authors List */}
                {formData.authors.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.authors.map((author, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="pl-3 pr-1 py-1.5"
                      >
                        {author}
                        <button
                          type="button"
                          onClick={() => handleRemoveAuthor(index)}
                          className="ml-2 hover:bg-destructive/20 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Journal */}
              <div className="space-y-2">
                <Label htmlFor="journal">Journal / Conference</Label>
                <Input
                  id="journal"
                  placeholder="e.g., IEEE Transactions on Pattern Analysis"
                  value={formData.journal}
                  onChange={(e) =>
                    setFormData({ ...formData, journal: e.target.value })
                  }
                  className="text-muted-foreground"
                />
              </div>

              {/* Year */}
              <div className="space-y-2">
                <Label htmlFor="year">Publication Year</Label>
                <Input
                  id="year"
                  type="number"
                  placeholder="e.g., 2024"
                  min="1900"
                  max="2100"
                  value={formData.year}
                  onChange={(e) =>
                    setFormData({ ...formData, year: e.target.value })
                  }
                  className="text-muted-foreground"
                />
              </div>

              {/* Link */}
              <div className="space-y-2">
                <Label htmlFor="link">Publication Link</Label>
                <Input
                  id="link"
                  type="url"
                  placeholder="https://doi.org/..."
                  value={formData.link}
                  onChange={(e) =>
                    setFormData({ ...formData, link: e.target.value })
                  }
                  className="text-muted-foreground"
                />
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
                <Button>
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-1" />
                      {editingPaper ? "Update" : "Create"}
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
              placeholder="Search papers by title, author, or journal..."
              className="pl-10 text-muted-foreground"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {filteredPapers.length} of {papers.length} papers
          </p>
        </CardContent>
      </Card>

      {/* Papers List */}
      {loading && papers.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : filteredPapers.length === 0 ? (
        <Card className="border-2 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full mb-4">
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No papers found</h3>
            <p className="text-sm text-muted-foreground text-center max-w-sm mb-4">
              {searchQuery
                ? "Try adjusting your search query"
                : "Get started by adding your first research paper"}
            </p>
            {!searchQuery && (
              <Button onClick={openCreateDialog}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Paper
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredPapers.map((paper) => (
            <Card
              key={paper._id}
              className="group hover:shadow-lg transition-all duration-300 border-2"
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    {/* Title */}
                    <CardTitle className="text-xl leading-tight">
                      {paper.title}
                    </CardTitle>

                    {/* Authors */}
                    {paper.authors &&
                      Array.isArray(paper.authors) &&
                      paper.authors.length > 0 && (
                        <div className="flex items-start gap-2">
                          <Users className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-muted-foreground">
                            {paper.authors.filter(Boolean).join(", ")}
                          </p>
                        </div>
                      )}

                    {/* Journal + Year + Link */}
                    <div className="flex flex-wrap items-center gap-3">
                      {paper.journal && (
                        <div className="flex items-center gap-1.5">
                          <BookOpen className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground italic">
                            {paper.journal}
                          </span>
                        </div>
                      )}

                      {paper.year && (
                        <Badge variant="outline" className="font-mono">
                          <Calendar className="w-3 h-3 mr-1" />
                          {paper.year}
                        </Badge>
                      )}

                      {paper.link && (
                        <a
                          href={paper.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          View Publication
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(paper)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(paper._id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Papers;
