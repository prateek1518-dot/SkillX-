import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    partnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    withUser: {
      type: String,
      required: [true, "Exchange partner name is required"],
      trim: true,
    },
    skill: {
      type: String,
      required: [true, "Skill name is required"],
      trim: true,
    },
    number: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      default: () =>
        `SKX-${new Date().getFullYear()}-${Math.floor(
          100000 + Math.random() * 900000
        )}`,
    },
    issuedOn: {
      type: String,
      default: () => new Date().toISOString().split("T")[0],
    },
  },
  {
    timestamps: true,
  }
);

const Certificate = mongoose.model("Certificate", certificateSchema);

export default Certificate;
