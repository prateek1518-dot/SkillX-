import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    offers: {
      type: String,
      required: [true, "Skill offered is required"],
      trim: true,
    },
    wants: {
      type: String,
      required: [true, "Skill wanted is required"],
      trim: true,
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 0,
      max: 5,
    },
    blurb: {
      type: String,
      required: [true, "A short blurb or description is required"],
      trim: true,
      maxlength: 300,
    },
    status: {
      type: String,
      enum: ["open", "in_progress", "completed"],
      default: "open",
    },
  },
  {
    timestamps: true,
  }
);

// Text index for fast searching on offers, wants, and user name
skillSchema.index({ offers: "text", wants: "text", user: "text" });

const Skill = mongoose.model("Skill", skillSchema);

export default Skill;
