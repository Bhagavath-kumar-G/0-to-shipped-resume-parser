
const { GoogleGenAI } = require("@google/genai");

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is missing from backend/.env");
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

async function generateAIFeedback(resumeText, jobDescription) {
  const prompt = `
You are a professional resume reviewer.

Analyze the resume against the job description.

Return these sections:
1. Overall assessment
2. Resume strengths (3 bullet points)
3. Areas to improve (3 bullet points)
4. Actionable suggestions (3 bullet points)
5. Relevant skills or experience missing from the resume

Be constructive, specific, and honest.
Do not invent qualifications or experience.
Do not guarantee interviews or hiring success.

RESUME:
${resumeText.slice(0, 12000)}

JOB DESCRIPTION:
${jobDescription.slice(0, 6000)}
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.8-flash",
    contents: prompt
  });

  const feedback = response.text;

  if (!feedback) {
    throw new Error("Gemini returned an empty response.");
  }

  return feedback;
}

module.exports = { generateAIFeedback };
