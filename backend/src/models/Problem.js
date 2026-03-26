const mongoose = require("mongoose");

const problemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    platform: {
      type: String,
      required: true,
      trim: true,
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Easy",
    },
    status: {
      type: String,
      enum: ["Unsolved", "Attempted", "Solved"],
      default: "Unsolved",
    },
    tags: {
      type: [String],
      default: [],
    },
    notes: {
      type: String,
      default: "",
    },
    solutionLink: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Problem", problemSchema);
