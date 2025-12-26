import { useEffect, useState } from "react";
import api from "@/services/api";

const Videos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("api/videos/admin", {});
        setVideos(data);
      } catch (error) {
        console.error("Failed to fetch videos: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  const addVideoHandler = async () => {
    try {
      setLoading(true);
      const { data: newVideo } = await api.post("/api/videos", {
        title: "Sample Video",
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        platform: "youtube",
        published: true,
      });
    } catch (error) {
      console.error("Failed to add video: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Videos</h2>

      <button
        className={`px-4 py-2 mb-4 text-white ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-black"
        }`}
        onClick={addVideoHandler}
        disabled={loading}
      >
        {loading ? "Processing..." : "Add Video"}
      </button>

      {loading && videos.length === 0 ? (
        <p>Loading videos...</p>
      ) : (
        <ul className="space-y-2">
          {videos.map((video) => (
            <li key={video._id} className="bg-white p-3 shadow">
              <p className="font-semibold">{video.title}</p>
              <p className="text-sm text-gray-600">{video.platform}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Videos;
