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
    status: {
      type: String,
      enum: ["Unsolved", "Attempted", "Solved"],
      default: "Unsolved",
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
