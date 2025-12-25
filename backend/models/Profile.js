import mongoose from "mongoose";

/*
  Academic Profile Schema
  Represents the single public identity of the professor
*/
const profileSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    designation: { type: String, trim: true },
    bio: { type: String },
    about: { type: String },
    contact: {
      email: String,
      phone: String,
      website: String,
    },
    socials: {
      facebook: String,
      instagram: String,
      linkedin: String,
      youtube: String,
    },
    photo: { type: String }, // URL (Later cloudinary)
  },
  {
    timestamps: true,
  }
);

const Profile = mongoose.model("Profile", profileSchema);
export default Profile;
