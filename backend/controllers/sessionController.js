import Session from "../models/Session.js";

// @desc    Get all learning sessions for current user
// @route   GET /api/sessions
// @access  Private
export const getSessions = async (req, res, next) => {
  try {
    const sessions = await Session.find({ userId: req.user._id }).sort({
      date: -1,
    });

    const formatted = sessions.map((s) => ({
      id: s._id.toString(),
      _id: s._id.toString(),
      withUser: s.withUser,
      skill: s.skill,
      date: s.date,
      status: s.status,
      note: s.note,
    }));

    res.json(formatted);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new learning session
// @route   POST /api/sessions
// @access  Private
export const createSession = async (req, res, next) => {
  try {
    const { withUser, skill, date, note, status } = req.body;

    if (!withUser || !skill || !note) {
      return res
        .status(400)
        .json({ message: "Partner name, skill, and note are required" });
    }

    const session = await Session.create({
      userId: req.user._id,
      withUser: withUser.trim(),
      skill: skill.trim(),
      date: date || new Date().toISOString().split("T")[0],
      note: note.trim(),
      status: status || "upcoming",
    });

    res.status(201).json({
      id: session._id.toString(),
      _id: session._id.toString(),
      withUser: session.withUser,
      skill: session.skill,
      date: session.date,
      status: session.status,
      note: session.note,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a session (e.g. mark completed)
// @route   PATCH /api/sessions/:id
// @access  Private
export const updateSession = async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (session.userId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this session" });
    }

    if (req.body.status) session.status = req.body.status;
    if (req.body.note) session.note = req.body.note.trim();
    if (req.body.date) session.date = req.body.date;

    await session.save();

    res.json({
      id: session._id.toString(),
      _id: session._id.toString(),
      withUser: session.withUser,
      skill: session.skill,
      date: session.date,
      status: session.status,
      note: session.note,
    });
  } catch (error) {
    next(error);
  }
};
