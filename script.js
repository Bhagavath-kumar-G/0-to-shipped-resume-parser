
const resumeInput = document.getElementById("resume");
const dropzone = document.getElementById("dropzone");
const browseButton = document.getElementById("browse-btn");
const selectedFileCard = document.getElementById("selected-file");
const fileName = document.getElementById("file-name");
const fileSize = document.getElementById("file-size");
const removeButton = document.getElementById("remove-file");
const analyseButton = document.getElementById("analyse-btn");
const message = document.getElementById("message");
const results = document.getElementById("results");

let selectedFile = null;

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

function showMessage(text) {
  message.textContent = text;
}

function formatFileSize(bytes) {
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function selectFile(file) {
  showMessage("");

  if (!file) return;

  const isPdf =
    file.type === "application/pdf" ||
    file.name.toLowerCase().endsWith(".pdf");

  if (!isPdf) {
    showMessage("Please choose a PDF file.");
    return;
  }

  if (file.size === 0) {
    showMessage("This file is empty. Please choose another PDF.");
    return;
  }

  if (file.size > MAX_FILE_SIZE) {
    showMessage("Please choose a PDF smaller than 10 MB.");
    return;
  }

  selectedFile = file;

  fileName.textContent = file.name;
  fileSize.textContent = `${formatFileSize(file.size)} · Ready for demo`;

  selectedFileCard.classList.remove("hidden");
  dropzone.classList.add("hidden");
  analyseButton.disabled = false;
}

function resetUpload() {
  selectedFile = null;
  resumeInput.value = "";

  selectedFileCard.classList.add("hidden");
  dropzone.classList.remove("hidden");
  analyseButton.disabled = true;

  showMessage("");
}

resumeInput.addEventListener("change", () => {
  selectFile(resumeInput.files[0]);
});

browseButton.addEventListener("click", (event) => {
  event.stopPropagation();
  resumeInput.click();
});

dropzone.addEventListener("click", (event) => {
  // The browse button has its own click handler.
  if (event.target.closest("button")) return;

  resumeInput.click();
});

dropzone.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    resumeInput.click();
  }
});

["dragenter", "dragover"].forEach((eventName) => {
  dropzone.addEventListener(eventName, (event) => {
    event.preventDefault();
    dropzone.classList.add("dragging");
  });
});

["dragleave", "drop"].forEach((eventName) => {
  dropzone.addEventListener(eventName, (event) => {
    event.preventDefault();
    dropzone.classList.remove("dragging");
  });
});

dropzone.addEventListener("drop", (event) => {
  const file = event.dataTransfer.files[0];
  selectFile(file);
});

removeButton.addEventListener("click", resetUpload);

function renderSkills(containerId, skills, isMissing = false) {
  const container = document.getElementById(containerId);
  container.replaceChildren();

  skills.forEach((skillName) => {
    const chip = document.createElement("span");

    chip.className = isMissing ? "skill missing" : "skill";
    chip.textContent = skillName;

    container.appendChild(chip);
  });
}

analyseButton.addEventListener("click", () => {
  if (!selectedFile) {
    showMessage("Please choose a PDF first.");
    return;
  }

  // DEMO ONLY: these values are not extracted from the PDF.
  const demoScore = 76;

  const presentSkills = [
    "Python",
    "HTML",
    "CSS",
    "JavaScript",
    "Git",
    "Problem Solving"
  ];

  const skillsToExplore = [
    "SQL",
    "React",
    "REST APIs",
    "Testing"
  ];

  document.getElementById("score").textContent = demoScore;

  document.getElementById("score-label").textContent =
    "Your sample report is ready";

  document.getElementById("score-description").textContent =
    "Explore this illustrative score and example skill breakdown.";

  const scoreRing = document.getElementById("score-ring");

  scoreRing.style.setProperty(
    "--score-angle",
    `${demoScore * 3.6}deg`
  );

  renderSkills("present-skills", presentSkills);
  renderSkills("missing-skills", skillsToExplore, true);

  results.classList.remove("hidden");

  results.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
});

document.getElementById("reset-btn").addEventListener("click", () => {
  resetUpload();
  results.classList.add("hidden");

  document.getElementById("analyzer").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
});
