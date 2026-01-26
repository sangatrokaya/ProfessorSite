import mongoose from "mongoose";

const courseSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    semester: {
      type: String,
    },
    image: {
      type: String, // Course thumbnail / Cover image
    },
    youtubePlaylist: {
      type: String,
    },
    materials: [
      {
        type: String, // Links to PDFs, Slides etc.
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Course = mongoose.model("Course", courseSchema);
export default Course;
