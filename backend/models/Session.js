import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    partnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    withUser: {
      type: String,
      required: true,
      trim: true,
    },
    skill: {
      type: String,
      required: [true, "Skill is required for the session"],
      trim: true,
    },
    date: {
      type: String,
      required: [true, "Date is required"],
      default: () => new Date().toISOString().split("T")[0],
    },
    status: {
      type: String,
      enum: ["upcoming", "completed"],
      default: "upcoming",
    },
    note: {
      type: String,
      required: [true, "Note is required"],
      trim: true,
    },
    requestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Request",
    },
  },
  {
    timestamps: true,
  }
);

const Session = mongoose.model("Session", sessionSchema);

export default Session;
