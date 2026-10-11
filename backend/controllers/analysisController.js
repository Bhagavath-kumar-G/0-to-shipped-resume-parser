const Analysis = require("../models/Analysis");
const { extractResumeText } = require("../services/resumeParser");
const { compareResume } = require("../services/skillMatcher");
const { generateAIFeedback } = require("../services/aiFeedback");

async function analyzeResume(req, res) {
  try {
    const resumeFile = req.file;
    const { jobDescription } = req.body;

    // 1. Validate uploaded resume
    if (!resumeFile) {
      return res.status(400).json({
        message: "Please upload a resume PDF."
      });
    }

    // 2. Validate job description
    if (
      typeof jobDescription !== "string" ||
      !jobDescription.trim()
    ) {
      return res.status(400).json({
        message: "Please provide a job description."
      });
    }

    // 3. Extract text from PDF
    const resumeText = await extractResumeText(resumeFile.buffer);

    if (!resumeText || !resumeText.trim()) {
      return res.status(400).json({
        message: "No readable text found in this PDF."
      });
    }

    // 4. Compare resume skills with job requirements
    const result = compareResume(resumeText, jobDescription);

    if (result.requiredSkills.length === 0) {
      return res.status(400).json({
        message:
          "No recognized skills found in the job description. Try including skills such as Python, React, or SQL."
      });
    }

    // 5. Generate Gemini AI feedback
    let aiFeedback = null;
    let aiFeedbackError = null;

    try {
      aiFeedback = await generateAIFeedback(
        resumeText,
        jobDescription.trim()
      );

      console.log("AI feedback generated successfully.");
    } catch (error) {
      // Temporary debugging: show the actual AI error
      console.error("Gemini error:", error.message);

      aiFeedbackError =
        error.message || "Unknown Gemini AI error.";
    }

    // 6. Save analysis to MongoDB
    const analysis = await Analysis.create({
      fileName: resumeFile.originalname,
      jobDescription: jobDescription.trim(),
      matchScore: result.matchScore,
      matchedSkills: result.matchedSkills,
      missingSkills: result.missingSkills
    });

    // 7. Return analysis results
    return res.status(200).json({
      message: "Resume analyzed successfully.",
      analysisId: analysis._id,
      matchScore: result.matchScore,
      resumeSkills: result.resumeSkills,
      requiredSkills: result.requiredSkills,
      matchedSkills: result.matchedSkills,
      missingSkills: result.missingSkills,
      aiFeedback,
      aiFeedbackError
    });
  } catch (error) {
    console.error("Resume analysis error:", error);

    return res.status(500).json({
      message: "Failed to analyze the resume."
    });
  }
}

module.exports = { analyzeResume };