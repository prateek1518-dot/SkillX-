import Request from "../models/Request.js";
import Skill from "../models/Skill.js";
import User from "../models/User.js";
import Session from "../models/Session.js";
import Certificate from "../models/Certificate.js";

// @desc    Get all exchange requests for the logged-in user
// @route   GET /api/requests
// @access  Private
export const getRequests = async (req, res, next) => {
  try {
    const currentUserId = req.user._id.toString();

    const requests = await Request.find({
      $or: [{ fromUser: req.user._id }, { toUser: req.user._id }],
    }).sort({ createdAt: -1 });

    const formatted = requests.map((r) => {
      const isIncoming = r.toUser.toString() === currentUserId;

      return {
        id: r._id.toString(),
        _id: r._id.toString(),
        direction: isIncoming ? "incoming" : "outgoing",
        withUser: isIncoming ? r.fromUserName : r.toUserName,
        theirSkill: isIncoming ? r.yourSkill : r.theirSkill,
        yourSkill: isIncoming ? r.theirSkill : r.yourSkill,
        status: r.status,
        sentOn: r.sentOn || new Date(r.createdAt).toISOString().split("T")[0],
      };
    });

    res.json(formatted);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new exchange request
// @route   POST /api/requests
// @access  Private
export const createRequest = async (req, res, next) => {
  try {
    const { skillListingId, toUser, toUserName, theirSkill, yourSkill } = req.body;

    let targetUserId = toUser;
    let targetUserName = toUserName;
    let skillWantedFromPartner = theirSkill;
    let skillOfferedByMe = yourSkill;

    if (skillListingId) {
      const listing = await Skill.findById(skillListingId);
      if (!listing) {
        return res.status(404).json({ message: "Skill listing not found" });
      }

      targetUserId = listing.userId;
      targetUserName = listing.user;
      skillWantedFromPartner = listing.offers;
      skillOfferedByMe =
        yourSkill ||
        (req.user.skillsOffered && req.user.skillsOffered[0]) ||
        listing.wants;
    }

    if (!targetUserId) {
      return res.status(400).json({ message: "Target user is required" });
    }

    if (targetUserId.toString() === req.user._id.toString()) {
      return res
        .status(400)
        .json({ message: "You cannot send an exchange request to yourself" });
    }

    // Check for existing pending request
    const existing = await Request.findOne({
      fromUser: req.user._id,
      toUser: targetUserId,
      theirSkill: skillWantedFromPartner,
      status: "pending",
    });

    if (existing) {
      return res.status(400).json({
        message: "You already have a pending exchange request with this user",
      });
    }

    const newRequest = await Request.create({
      fromUser: req.user._id,
      fromUserName: req.user.name,
      toUser: targetUserId,
      toUserName: targetUserName || "SkillX Partner",
      skillListingId: skillListingId || null,
      theirSkill: skillWantedFromPartner,
      yourSkill: skillOfferedByMe,
      status: "pending",
      sentOn: new Date().toISOString().split("T")[0],
    });

    res.status(201).json({
      id: newRequest._id.toString(),
      _id: newRequest._id.toString(),
      direction: "outgoing",
      withUser: newRequest.toUserName,
      theirSkill: newRequest.theirSkill,
      yourSkill: newRequest.yourSkill,
      status: newRequest.status,
      sentOn: newRequest.sentOn,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update request status (accept, decline, complete)
// @route   PATCH /api/requests/:id
// @access  Private
export const updateRequestStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ["pending", "active", "declined", "done"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    const currentUserId = req.user._id.toString();
    const isRecipient = request.toUser.toString() === currentUserId;
    const isSender = request.fromUser.toString() === currentUserId;

    if (!isRecipient && !isSender) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this request" });
    }

    request.status = status;
    await request.save();

    // If accepted (status became "active"), automatically create initial upcoming sessions
    if (status === "active") {
      const today = new Date();
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];

      // Session for recipient
      await Session.create({
        userId: request.toUser,
        partnerId: request.fromUser,
        withUser: request.fromUserName,
        skill: request.yourSkill,
        date: nextWeek,
        status: "upcoming",
        note: `Session 1 of exchange — kicking off ${request.yourSkill}.`,
        requestId: request._id,
      });

      // Session for sender
      await Session.create({
        userId: request.fromUser,
        partnerId: request.toUser,
        withUser: request.toUserName,
        skill: request.theirSkill,
        date: nextWeek,
        status: "upcoming",
        note: `Session 1 of exchange — learning ${request.theirSkill}.`,
        requestId: request._id,
      });
    }

    // If marked "done", issue certificate for both users
    if (status === "done") {
      await Certificate.create([
        {
          userId: request.fromUser,
          userName: request.fromUserName,
          partnerId: request.toUser,
          withUser: request.toUserName,
          skill: request.theirSkill,
        },
        {
          userId: request.toUser,
          userName: request.toUserName,
          partnerId: request.fromUser,
          withUser: request.fromUserName,
          skill: request.yourSkill,
        },
      ]);
    }

    const isIncoming = request.toUser.toString() === currentUserId;

    res.json({
      id: request._id.toString(),
      _id: request._id.toString(),
      direction: isIncoming ? "incoming" : "outgoing",
      withUser: isIncoming ? request.fromUserName : request.toUserName,
      theirSkill: isIncoming ? request.yourSkill : request.theirSkill,
      yourSkill: isIncoming ? request.theirSkill : request.yourSkill,
      status: request.status,
      sentOn: request.sentOn,
    });
  } catch (error) {
    next(error);
  }
};
