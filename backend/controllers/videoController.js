import Video from "../models/Video.js";

// @desc Get published videos
// @route GET /api/videos
// @access Public
export const getVideos = async (req, res) => {
  const videos = await Video.find({ published: true }).sort({ createdAt: -1 });
  res.json(videos);
};

// @desc Get all videos (Admin)
// @route GET /api/videos/admin
// @access Admin
export const getAllVideosAdmin = async (req, res) => {
  const videos = await Video.find().sort({ createdAt: -1 });
  res.json(videos);
};

// @desc Create a new video
// @route POST /api/videos
// @access Admin
export const createVideo = async (req, res) => {
  const { title, url, platform, description, published } = req.body;

  const video = new Video({
    title,
    url,
    platform,
    description,
    published,
  });

  const createdVideo = await video.save();
  res.status(201).json(createdVideo);
};

// @desc Delete a video
// @route DELETE /api/videos/:id
// @access Admin
export const deleteVideo = async (req, res) => {
  const video = await Video.findById(req.params.id);

  if (video) {
    await video.deleteOne();
    res.json({ message: "Video removed successfully..." });
  } else {
    res.status(404).json({ message: "Video not found!" });
  }
};
