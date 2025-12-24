import Profile from "../models/Profile.js";

// @desc Get public profile
// @route GET /api/profile
// @access Public
export const getProfile = async (req, res) => {
  const profile = await Profile.findOne();
  res.json(profile);
};

// @desc Create or update profile
// @route PUT /api/profile
// @access Admin
export const upsertProfile = async (req, res) => {
  const profile = await Profile.findOne();

  if (profile) {
    const updatedProfile = await Profile.findByIdAndUpdate(
      profile._id,
      req.body,
      { new: true }
    );
    res.json(updatedProfile);
  } else {
    const createdProfile = await Profile.create(req.body);
    res.status(201).json(createdProfile);
  }
};
