import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "@/services/api";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const blogsRes = await api.get("/api/blogs");
      const videosRes = await api.get("/api/videos");

      setBlogs(blogsRes.data.slice(0, 3));
      setVideos(videosRes.data.slice(0, 3));
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-24">
      {/* HERO */}
      <section className="text-center py-24 px-6 bg-muted/40 rounded-xl">
        <div className="max-w-3xl mx-auto space-y-6">
          <Badge variant="outline" className="mx-auto">
            Academic Portfolio
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Asst. Prof. Bhim Rokaya
          </h1>
          <p className="text-xl text-muted-foreground">
            Teacher • Researcher • Educator
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Exploring knowledge through teaching, research, and publications,
            with a focus on academic excellence and modern computing
          </p>

          <div className="flex justify-center gap-4 pt-4">
            <Button size="lg" asChild>
              <Link to="/papers">View Papers</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/contact">Contact Me</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* BLOGS */}
      <section className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Latest Blogs</h2>
          <Link to="/blogs" className="text-sm underline text-muted-foreground">
            View all
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <Card key={blog._id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="line-clamp-2">{blog.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {blog.content}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* VIDEOS */}
      <section className="container mx-auto mb-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Latest Videos</h2>
          <Link
            to="/videos"
            className="text-sm underline text-muted-foreground"
          >
            View all
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {videos.map((video) => (
            <Card key={video._id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="line-clamp-2">{video.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary" className="capitalize">
                  {video.platform}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
