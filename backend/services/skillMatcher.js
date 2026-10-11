
const SKILLS = [
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "C++",
  "C",
  "React",
  "Node.js",
  "Express",
  "MongoDB",
  "SQL",
  "HTML",
  "CSS",
  "Git",
  "GitHub",
  "REST API",
  "Machine Learning",
  "Data Analysis",
  "TensorFlow",
  "PyTorch",
  "Communication",
  "Problem Solving"
];

// Escape special characters before using a skill in a regex.
function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Find recognized skills without matching partial words.
function findSkills(text) {
  const foundSkills = [];
  const normalizedText = text.toLowerCase();

  for (const skill of SKILLS) {
    const escapedSkill = escapeRegExp(skill);

    const pattern = new RegExp(
      `(^|[^a-zA-Z0-9+#])${escapedSkill}(?=$|[^a-zA-Z0-9+#])`,
      "i"
    );

    if (pattern.test(normalizedText)) {
      foundSkills.push(skill);
    }
  }

  return foundSkills;
}

function compareResume(resumeText, jobDescription) {
  const resumeSkills = findSkills(resumeText);
  const requiredSkills = findSkills(jobDescription);

  const matchedSkills = requiredSkills.filter(skill =>
    resumeSkills.includes(skill)
  );

  const missingSkills = requiredSkills.filter(skill =>
    !resumeSkills.includes(skill)
  );

  // A score cannot be calculated if no recognized skills are required.
  const matchScore =
    requiredSkills.length === 0
      ? null
      : Math.round(
          (matchedSkills.length / requiredSkills.length) * 100
        );

  return {
    matchScore,
    resumeSkills,
    requiredSkills,
    matchedSkills,
    missingSkills
  };
}

module.exports = { findSkills, compareResume };
