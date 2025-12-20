import mongoose from "mongoose";

const videoSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    platform: {
      type: String,
      enum: ["youtube", "facebook", "instagram", "other"],
      default: "youtube",
    },
    description: {
      type: String,
    },
    published: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Video = mongoose.model("Video", videoSchema);
export default Video;
