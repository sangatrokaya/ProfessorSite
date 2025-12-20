import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "@/services/api";

const Videos = () => {
  const [videos, setVideos] = useState([]);
  const { adminInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchVideos = async () => {
      const { data } = await api.get("api/videos/admin", {
        headers: {
          Authorization: `Bearer ${adminInfo.token}`,
        },
      });
      setVideos(data);
    };
    if (adminInfo) fetchVideos();
  }, [adminInfo]);

  const addVideoHandler = async () => {
    await api.post(
      "/api/videos",
      {
        title: "Sample Video",
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        platform: "youtube",
        published: true,
      },
      {
        headers: {
          Authorization: `Bearer ${adminInfo.token}`,
        },
      }
    );
    window.location.reload();
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Videos</h2>

      <button
        className="bg-black text-white px-4 py-2 mb-4"
        onClick={addVideoHandler}
      >
        Add Video
      </button>

      <ul className="space-y-2">
        {videos.map((video) => (
          <li key={video._id} className="bg-white p-3 shadow">
            <p className="font-semibold">{video.title}</p>
            <p className="text-sm text-gray-600">{video.platform}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Videos;
