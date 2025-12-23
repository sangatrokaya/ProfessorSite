import mongoose from "mongoose";

const profileSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    designation: { type: String },
    bio: { type: String },
    about: { type: String },
    email: { type: String },
    phone: { type: String },
    website: { type: String },
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
