import mongoose from "mongoose";

const paperSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    authors: [
      {
        type: String,
        required: true,
      },
    ],
    journal: {
      type: String,
    },
    year: {
      type: Number,
    },
    link: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Paper = mongoose.model("Paper", paperSchema);
export default Paper;
