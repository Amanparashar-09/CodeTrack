const mongoose = require("mongoose");

const questionBankSchema = new mongoose.Schema(
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
    tags: {
      type: [String],
      default: [],
    },
    url: {
      type: String,
      default: "",
      trim: true,
    },
    isPredefined: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

questionBankSchema.index({ title: 1, platform: 1 }, { unique: true });

module.exports = mongoose.model("QuestionBank", questionBankSchema);
