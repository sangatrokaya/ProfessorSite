import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "@/services/api";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CardSkeleton from "@/components/skeletons/CardSkeleton";
import {
  BookOpen,
  Video,
  FileText,
  GraduationCap,
  ArrowRight,
  Mail,
  Sparkles,
  Icon,
} from "lucide-react";

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [videos, setVideos] = useState([]);
  const [papers, setPapers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const blogsRes = await api.get("/api/blogs");
        const videosRes = await api.get("/api/videos");
        const papersRes = await api.get("/api/papers");
        const coursesRes = await api.get("/api/courses");

        setBlogs(blogsRes.data.slice(0, 3));
        setVideos(videosRes.data.slice(0, 3));
        setPapers(papersRes.data.slice(0, 3));
        setCourses(coursesRes.data.slice(0, 3));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const SkeletonGrid = ({ count = 3 }) => (
    <div className="grid md:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );

  const SectionHeader = ({
    icon: Icon,
    title,
    link,
    linkText = "View all",
  }) => (
    <div className="flex justify-between items-center mb-8">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
      </div>
      <Link
        to={link}
        className="text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center group gap-1"
      >
        {linkText}
      </Link>
      <ArrowRight className="w-4 h-4 group-hover: translate-x-1 transition-transform" />
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 t0-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 bg-grid-slate-200 dark:bg-grid-slate-800 [mask-image:linear-gradient(0deg, transparent, black)] opacity-20" />
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full blur-3xl opacity-10" />
        <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-96 h-96 bg-gradient-to-tr from-violet-400 to-purple-600 rounded-full blur-3xl opacity-10" />

        <div className="relative container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Badge */}
            <div className="flex justify-center">
              <Badge
                variant="secondary"
                className="px-4 py-1.5 text-sm font-medium rounded-full border shadow-sm"
              >
                <Sparkles className="w-3 h-3 mr-1.5 inline" />
                Academic Portfolio
              </Badge>
            </div>
            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight bg-gradient-to-br from-slate-900 via-slate-800 to-slate-600 dark:from-white dark:via-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
                Asst. Prof. Bhim Rokaya
              </h1>
              <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 font-medium">
                Teacher • Researcher • Creator
              </p>
            </div>
            {/* Description */}
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Exploring knowledge through teaching, research, and publications,
              with a focus on academic excellence and modern computing
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap justify-center gap-4 pt-6">
              <Button
                size="lg"
                className="px-8 shadow-lg hover:shadow-xl transition-shadow"
                asChild
              >
                <Link to="/papers">
                  <FileText className="w-4 h-4 mr-0" />
                  View Papers
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="px-8" asChild>
                <Link to="/contact">
                  <Mail className="w-4 h-4 mr-0" />
                  Contact Me
                </Link>
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 max-w-3xl mx-auto">
              {[
                {
                  label: "Papers",
                  value: papers.length || "0",
                  icon: FileText,
                },
                {
                  label: "Videos",
                  value: videos.length || "0",
                  icon: Video,
                },
                {
                  label: "Blogs",
                  value: blogs.length || "0",
                  icon: BookOpen,
                },
                {
                  label: "Courses",
                  value: courses.length || "0",
                  icon: GraduationCap,
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="p-4 rounded-lg bg-white/50 dark:bg-slate-900/50 backdrop-blur border border-slate-200 dark:border-slate-800"
                >
                  <stat.icon className="w-5 h-5 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <div className="container mx-auto px-4 py-16 space-y-24">
        {/* Blogs Section  */}
        <section>
          <SectionHeader icon={BookOpen} title="Featured Blogs" link="/blogs" />
          {loading ? (
            <SkeletonGrid />
          ) : (
            <div className="grid md:grid-cols-3 lg:grid-cols-3 gap-6">
              {blogs.map((blog) => (
                <Card
                  key={blog._id}
                  className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/20"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="p-2 bg-blue-100 dark:bg-blue-950 rounded-lg">
                        <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        Blog
                      </Badge>
                    </div>
                    <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                      {blog.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                      {blog.content}
                    </p>
                    <Link
                      to={`/blogs/${blog._id}`}
                      className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1"
                    >
                      Read more
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Videos Section */}
        <section>
          <SectionHeader icon={Video} title="Featured Videos" link="/videos" />
          {loading ? (
            <SkeletonGrid />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <Card
                  key={video._id}
                  className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/20"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="p-2 bg-red-100 dark:bg-red-950 rounded-lg">
                        <Video className="w-4 h-4 text-red-600 dark:text-red-400" />
                      </div>
                      <Badge variant="secondary" className="capitalize text-xs">
                        {video.platform}
                      </Badge>
                    </div>
                    <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                      {video.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Link
                      to={`/videos/${video._id}`}
                      className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1"
                    >
                      Watch video
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Featured Papers Section */}
        <section>
          <SectionHeader
            icon={FileText}
            title="Featured Publications"
            link="/papers"
          />
          {loading ? (
            <SkeletonGrid />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {papers.map((paper) => (
                <Card
                  key={paper._id}
                  className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/20"
                >
                  <CardHeader className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="p-2 bg-green-100 dark:bg-green-950 rounded-lg">
                        <FileText className="w-4 h-4 text-green-600 dark:text-green-400" />
                      </div>
                      {paper.year && (
                        <Badge variant="outline" className="text-xs font-mono">
                          {paper.year}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="line-clamp-2 text-base group-hover:text-primary transition-colors">
                      {paper.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {paper.journal && (
                      <p className="text-sm text-muted-foreground line-clamp-2 italic">
                        {paper.journal}
                      </p>
                    )}
                    {paper.link && (
                      <a
                        href={paper.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1"
                      >
                        View publication
                        <ArrowRight className="w-3 h-3" />
                      </a>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Featured Courses Section */}
        <section>
          <SectionHeader
            icon={GraduationCap}
            title="Featured Courses"
            link="/courses"
          />
          {loading ? (
            <SkeletonGrid />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Card
                  key={course._id}
                  className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/20"
                >
                  <CardHeader className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="p-2 bg-purple-100 dark:bg-purple-950 rounded-lg">
                        <GraduationCap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      </div>
                      {course.semester && (
                        <Badge variant="outline" className="text-xs">
                          {course.semester}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="line-clamp-2 text-base group-hover:text-primary transition-colors">
                      {course.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {course.description}
                    </p>
                    <Button
                      variant="ghost"
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                      asChild
                    >
                      <Link to={`/courses/${course._id}`}>
                        View Course Details
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Home;
