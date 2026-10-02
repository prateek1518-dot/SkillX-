import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Skill from "../models/Skill.js";

// Helper to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, skillOffered, skillWanted } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email and password are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res
        .status(400)
        .json({ message: "An account with this email already exists" });
    }

    const skillsOffered = skillOffered && skillOffered.trim() ? [skillOffered.trim()] : [];
    const skillsWanted = skillWanted && skillWanted.trim() ? [skillWanted.trim()] : [];

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      skillsOffered,
      skillsWanted,
      rating: 4.8,
    });

    // If both initial offered and wanted skills are provided, create an initial Skill Listing
    if (skillOffered && skillWanted) {
      await Skill.create({
        user: user.name,
        userId: user._id,
        offers: skillOffered.trim(),
        wants: skillWanted.trim(),
        rating: user.rating,
        blurb: `Looking to trade ${skillOffered.trim()} for ${skillWanted.trim()}. Ready to pair!`,
      });
    }

    const token = generateToken(user._id);

    res.status(201).json({
      message: "Registration successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        rating: user.rating,
        skillsOffered: user.skillsOffered,
        skillsWanted: user.skillsWanted,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        rating: user.rating,
        skillsOffered: user.skillsOffered,
        skillsWanted: user.skillsWanted,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
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
