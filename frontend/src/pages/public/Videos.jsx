import { useEffect, useState } from "react";
import api from "@/services/api";

const Videos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const { data } = await api.get("/api/videos");
        setVideos(data);
      } catch (error) {
        console.error("Failed to fetch videos!", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  if (loading) {
    return <p>Loading videos...</p>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      {/* PAGE HEADER */}
      <section>
        <h1 className="text-3xl font-bold mb-2">Videos</h1>
        <p className="text-gray-600">
          Lectures, talks, and academic video resources.
        </p>
      </section>

      {/* VIDEO GRID */}
      <section className="grid md:grid-cols-2 gap-8">
        {videos.length === 0 ? (
          <p className="text-gray-500">No videos available!</p>
        ) : (
          videos.map((video) => (
            <div
              key={video._id}
              className="border rounded-md overflow-hidden bg-gray-200"
            >
              {/* EMBED */}
              <div className="aspect-video">
                <iframe
                  src={video.videoUrl}
                  title={video.title}
                  className="w-full h-full"
                  allowFullScreen
                />
              </div>

              {/* META */}
              <div className="p-4 space-y-2">
                <h2 className="font-semibold text-lg">{video.title}</h2>

                {video.description && (
                  <p className="text-sm text-gray-600">{video.description}</p>
                )}
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
};

export default Videos;
