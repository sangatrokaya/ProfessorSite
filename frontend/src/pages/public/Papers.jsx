import { useEffect, useState } from "react";
import api from "@/services/api";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

import {
  FileText,
  ExternalLink,
  Search,
  Filter,
  Calendar,
  Users,
  BookOpen,
  Download,
  Share2,
} from "lucide-react";

const Papers = () => {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState("all");

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        const { data } = await api.get("/api/papers");
        setPapers(data);
      } catch (error) {
        console.error("Failed to fetch papers!", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPapers();
  }, []);

  // Filter papers based on search and year
  const filteredPapers = papers.filter((paper) => {
    const matchesSearch =
      paper.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (Array.isArray(paper.authors) &&
        paper.authors.some((author) =>
          author?.toLowerCase().includes(searchQuery.toLowerCase()),
        )) ||
      paper.journal?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesYear =
      selectedYear === "all" || paper.year?.toString() === selectedYear;

    return matchesSearch && matchesYear;
  });

  // Get unique years for filter
  const years = [
    "all",
    ...new Set(papers.map((p) => p.year).filter(Boolean)),
  ].sort((a, b) => (a === "all" ? -1 : b === "all" ? 1 : b - a));

  // Share Handler
  const handleShare = async (paper) => {
    if (!paper?.link) return;

    try {
      if (navigator.share) {
        await navigator.share({
          title: paper.title,
          text: `Check out this paper: ${paper.title}`,
          url: paper.link,
        });
      } else {
        await navigator.clipboard.writeText(paper.link);
        alert("paper link copied to clipboard!");
      }
    } catch (err) {
      console.error("Share failed: ", err);
      alert("Unable to share the paper.");
    }
  };

  // Loading Skeleton
  const PaperSkeleton = () => (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3" />
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-b">
        {/* Decorative Elements */}
        <div className="absolute inset-0 bg-grid-slate-200 dark:bg-grid-slate-800 [mask-image:linear-gradient(0deg, transparent, black)] opacity-20" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full blur-3xl opacity-20" />

        <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-24">
          <div className="max-w-5xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <Badge variant="secondary" className="text-sm">
                Research & Publications
              </Badge>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-br from-slate-900 via-slate-800 to-slate-600 dark:from-white dark:via-slate-200 dark:to-slate-400 bg-clip-text text-transparent mb-4">
              Papers & Publications
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
              A comprehensive collection of academic papers, research
              publications, and scholarly contributions spanning various domains
              of study.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 dark:bg-blue-950 rounded-lg">
                  <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{papers.length}</div>
                  <div className="text-xs text-muted-foreground">
                    Publications
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="p-2 bg-green-100 dark:bg-green-950 rounded-lg">
                  <Calendar className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {years.filter((y) => y !== "all").length}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Years Active
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        {/* Search & Filter Bar */}
        <Card className="mb-8 border-2">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by title, author, or journal..."
                  className="pl-10 text-muted-foreground"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Year Filter */}
              <div className="relative min-w-[30px]">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <select
                  className="w-full h-10 pl-10 pr-4 border rounded-md bg-background"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year === "all" ? "All Years" : year}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Results count */}
            <div className="mt-4 text-sm text-muted-foreground">
              Showing {filteredPapers.length} of {papers.length} publications
            </div>
          </CardContent>
        </Card>

        {/* Papers List */}
        <div className="space-y-6">
          {loading ? (
            // Loading skeletons
            <>
              <PaperSkeleton />
              <PaperSkeleton />
              <PaperSkeleton />
            </>
          ) : filteredPapers.length === 0 ? (
            // Empty state
            <Card className="border-2 border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full mb-4">
                  <FileText className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  No publications found!
                </h3>
                <p className="text-sm text-muted-foreground text-center max-w-sm">
                  {searchQuery || selectedYear !== "all"
                    ? "Try adjusting your search or filter criteria"
                    : "No publications available at the moment!"}
                </p>
              </CardContent>
            </Card>
          ) : (
            // Paper Grid
            filteredPapers.map((paper, index) => (
              <Card
                key={paper._id || index}
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/20"
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      {/* Title */}
                      <h2 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors">
                        {paper.title}
                      </h2>

                      {/* Authors */}
                      {paper.authors &&
                        Array.isArray(paper.authors) &&
                        paper.authors.length > 0 && (
                          <div className="flex items-start gap-2">
                            <Users className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              {paper.authors.filter(Boolean).join(", ")}
                            </p>
                          </div>
                        )}

                      {/* Journal & Year */}
                      <div className="flex flex-wrap items-center gap-3">
                        {paper.journal && (
                          <div className="flex items-center gap-1.5">
                            <BookOpen className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 italic">
                              {paper.journal}
                            </span>
                          </div>
                        )}

                        {paper.year && (
                          <Badge variant="outline" className="font-mono">
                            <Calendar className="w-3 h-3  mr-1" />
                            {paper.year}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Icon */}
                    <div className="p-3 bg-green-100 dark:bg-green-950 rounded-lg group-hover:scale-110 transition-transform">
                      <FileText className="w-4 h-4  text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                </CardHeader>

                {/* Actions */}
                {paper.link && (
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="default" size="sm" asChild>
                        <a
                          href={paper.link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="w-4 h-4 mr-1" />
                          View Publication
                        </a>
                      </Button>

                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={paper.link}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </a>
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleShare(paper)}
                      >
                        <Share2 className="w-4 h-4 mr-1" />
                        Share
                      </Button>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default Papers;
