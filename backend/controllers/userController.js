import User from "../models/User.js";

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      rating: user.rating,
      skillsOffered: user.skillsOffered,
      skillsWanted: user.skillsWanted,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.body.name) user.name = req.body.name.trim();
    if (req.body.skillsOffered) user.skillsOffered = req.body.skillsOffered;
    if (req.body.skillsWanted) user.skillsWanted = req.body.skillsWanted;

    const updatedUser = await user.save();

    res.json({
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      rating: updatedUser.rating,
      skillsOffered: updatedUser.skillsOffered,
      skillsWanted: updatedUser.skillsWanted,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a skill to user's offered or wanted list
// @route   POST /api/users/skills
// @access  Private
export const addSkill = async (req, res, next) => {
  try {
    const { type, skill } = req.body; // type: 'offered' | 'wanted'
    const trimmedSkill = skill?.trim();

    if (!trimmedSkill) {
      return res.status(400).json({ message: "Skill cannot be empty" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (type === "offered") {
      if (!user.skillsOffered.includes(trimmedSkill)) {
        user.skillsOffered.push(trimmedSkill);
      }
    } else if (type === "wanted") {
      if (!user.skillsWanted.includes(trimmedSkill)) {
        user.skillsWanted.push(trimmedSkill);
      }
    } else {
      return res.status(400).json({ message: "Invalid type. Must be 'offered' or 'wanted'" });
    }

    await user.save();

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      rating: user.rating,
      skillsOffered: user.skillsOffered,
      skillsWanted: user.skillsWanted,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove a skill from user's offered or wanted list
// @route   DELETE /api/users/skills
// @access  Private
export const removeSkill = async (req, res, next) => {
  try {
    const { type, skill } = req.body;
    const trimmedSkill = skill?.trim();

    if (!trimmedSkill) {
      return res.status(400).json({ message: "Skill cannot be empty" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (type === "offered") {
      user.skillsOffered = user.skillsOffered.filter((s) => s !== trimmedSkill);
    } else if (type === "wanted") {
      user.skillsWanted = user.skillsWanted.filter((s) => s !== trimmedSkill);
    } else {
      return res.status(400).json({ message: "Invalid type. Must be 'offered' or 'wanted'" });
    }

    await user.save();

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      rating: user.rating,
      skillsOffered: user.skillsOffered,
      skillsWanted: user.skillsWanted,
    });
  } catch (error) {
    next(error);
  }
};
