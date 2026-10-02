import Skill from "../models/Skill.js";
import User from "../models/User.js";

// @desc    Get all skill listings with optional search & limit
// @route   GET /api/skills
// @access  Public
export const getSkills = async (req, res, next) => {
  try {
    const { search, q, limit } = req.query;
    const queryTerm = search || q;

    let filter = {};

    if (queryTerm && queryTerm.trim()) {
      const regex = new RegExp(queryTerm.trim(), "i");
      filter = {
        $or: [{ offers: regex }, { wants: regex }, { user: regex }],
      };
    }

    let query = Skill.find(filter).sort({ createdAt: -1 });

    if (limit) {
      query = query.limit(parseInt(limit, 10));
    }

    const listings = await query.exec();

    // Map to ensure both id and _id are available for frontend compatibility
    const formatted = listings.map((l) => ({
      id: l._id.toString(),
      _id: l._id.toString(),
      user: l.user,
      userId: l.userId,
      offers: l.offers,
      wants: l.wants,
      rating: l.rating,
      blurb: l.blurb,
      status: l.status,
      createdAt: l.createdAt,
    }));

    res.json(formatted);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single skill listing by ID
// @route   GET /api/skills/:id
// @access  Public
export const getSkillById = async (req, res, next) => {
  try {
    const listing = await Skill.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: "Skill listing not found" });
    }

    res.json({
      id: listing._id.toString(),
      _id: listing._id.toString(),
      user: listing.user,
      userId: listing.userId,
      offers: listing.offers,
      wants: listing.wants,
      rating: listing.rating,
      blurb: listing.blurb,
      status: listing.status,
      createdAt: listing.createdAt,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new skill listing
// @route   POST /api/skills
// @access  Private
export const createSkill = async (req, res, next) => {
  try {
    const { offers, wants, blurb } = req.body;

    if (!offers || !wants || !blurb) {
      return res.status(400).json({
        message: "Offers, wants, and a short blurb are all required",
      });
    }

    const listing = await Skill.create({
      user: req.user.name,
      userId: req.user._id,
      offers: offers.trim(),
      wants: wants.trim(),
      rating: req.user.rating || 4.8,
      blurb: blurb.trim(),
    });

    // Also ensure user's skillsOffered and skillsWanted reflect this
    const user = await User.findById(req.user._id);
    if (user) {
      if (!user.skillsOffered.includes(offers.trim())) {
        user.skillsOffered.push(offers.trim());
      }
      if (!user.skillsWanted.includes(wants.trim())) {
        user.skillsWanted.push(wants.trim());
      }
      await user.save();
    }

    res.status(201).json({
      id: listing._id.toString(),
      _id: listing._id.toString(),
      user: listing.user,
      userId: listing.userId,
      offers: listing.offers,
      wants: listing.wants,
      rating: listing.rating,
      blurb: listing.blurb,
      status: listing.status,
      createdAt: listing.createdAt,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a skill listing
// @route   DELETE /api/skills/:id
// @access  Private
export const deleteSkill = async (req, res, next) => {
  try {
    const listing = await Skill.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: "Skill listing not found" });
    }

    // Check ownership
    if (listing.userId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this listing" });
    }

    await listing.deleteOne();

    res.json({ message: "Skill listing removed successfully" });
  } catch (error) {
    next(error);
  }
};
