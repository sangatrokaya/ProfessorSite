import Profile from "../models/Profile.js";

// @desc Get public professor profile
// @route GET /api/profile
// @access Public
export const getPublicProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne();

    if (!profile) {
      return res.status(404).json({ message: "Profile not created yet!" });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch  profile!" });
  }
};

// @desc Create or update professor profile (singleton)
// @route PUT /api/profile
// @access Admin
export const upsertProfile = async (req, res) => {
  try {
    const existingProfile = await Profile.findOne();

    if (existingProfile) {
      const updatedProfile = await Profile.findByIdAndUpdate(
        existingProfile._id,
        req.body,
        { new: true }
      );
      return res.json(updatedProfile);
    }

    const newProfile = await Profile.create(req.body);
    res.status(201).json(newProfile);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Profile update failed!", error: error.message });
  }
};
