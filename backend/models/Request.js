import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    fromUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fromUserName: {
      type: String,
      required: true,
      trim: true,
    },
    toUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    toUserName: {
      type: String,
      required: true,
      trim: true,
    },
    skillListingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Skill",
    },
    theirSkill: {
      type: String,
      required: [true, "The requested skill is required"],
      trim: true,
    },
    yourSkill: {
      type: String,
      required: [true, "Your offered skill is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "active", "done", "declined"],
      default: "pending",
    },
    sentOn: {
      type: String,
      default: () => new Date().toISOString().split("T")[0],
    },
  },
  {
    timestamps: true,
  }
);

const Request = mongoose.model("Request", requestSchema);

export default Request;
