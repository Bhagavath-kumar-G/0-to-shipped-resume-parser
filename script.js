
const resumeInput = document.getElementById("resume");
const fileName = document.getElementById("file-name");
const analyseBtn = document.getElementById("analyse-btn");
const message = document.getElementById("message");
const results = document.getElementById("results");

let selectedFile = null;

resumeInput.addEventListener("change", () => {
  const file = resumeInput.files[0];

  message.textContent = "";
  selectedFile = null;
  analyseBtn.disabled = true;

  if (!file) {
    fileName.textContent = "PDF files only";
    return;
  }

  if (
    file.type !== "application/pdf" &&
    !file.name.toLowerCase().endsWith(".pdf")
  ) {
    fileName.textContent = "PDF files only";
    message.textContent = "Please select a PDF file.";
    resumeInput.value = "";
    return;
  }

  selectedFile = file;
  fileName.textContent = file.name;
  analyseBtn.disabled = false;
});

analyseBtn.addEventListener("click", () => {
  if (!selectedFile) return;

  const present = [
    "Python",
    "HTML",
    "CSS",
    "JavaScript",
    "Git",
    "Problem Solving"
  ];

  const missing = [
    "SQL",
    "React",
    "REST APIs",
    "Testing"
  ];

  // Illustrative demo score, not calculated from the PDF.
  const score = 76;

  document.getElementById("score").textContent = score;
  document.getElementById("score-label").textContent =
    "Demo analysis complete";
  document.getElementById("score-description").textContent =
    "This is a sample score for demonstration purposes.";

  renderSkills("present-skills", present, false);
  renderSkills("missing-skills", missing, true);

  results.classList.remove("hidden");
  results.scrollIntoView({ behavior: "smooth" });
});

function renderSkills(elementId, skills, isMissing) {
  const container = document.getElementById(elementId);
  container.replaceChildren();

  skills.forEach((skillName) => {
    const chip = document.createElement("span");
    chip.className = isMissing ? "skill missing" : "skill";
    chip.textContent = skillName;
    container.appendChild(chip);
  });
}

document.getElementById("reset-btn").addEventListener("click", () => {
  resumeInput.value = "";
  selectedFile = null;
  fileName.textContent = "PDF files only";
  message.textContent = "";
  analyseBtn.disabled = true;
  results.classList.add("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
});
    