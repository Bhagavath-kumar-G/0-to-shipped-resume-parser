
const mongoose = require("mongoose");

const analysisSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: true
    },
    jobDescription: {
      type: String,
      required: true
    },
    matchScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    matchedSkills: {
      type: [String],
      default: []
    },
    missingSkills: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Analysis", analysisSchema);
