
import { useState } from "react";
import "./App.css";

function App() {
  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    if (!resume) {
      setError("Please upload your resume PDF.");
      return;
    }

    if (!jobDescription.trim()) {
      setError("Please enter the job description.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", resume);
    formData.append("jobDescription", jobDescription);

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(
        "http://localhost:5000/api/analyze",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Analysis failed.");
      }

      setResult(data);
    } catch (err) {
      setError(
        err.message ||
          "Could not connect to the backend. Check that it is running."
      );
    } finally {
      setLoading(false);
    }
  }

  function renderAIFeedback(feedback) {
    if (!feedback) return null;

    return feedback.split(/\r?\n/).map((line, index) => {
      const text = line.trim();

      if (!text || /^---+$/.test(text)) return null;

      if (/^#{1,6}\s+/.test(text)) {
        return (
          <h3 key={index}>
            {text.replace(/^#{1,6}\s+/, "").replace(/^\d+\.\s*/, "")}
          </h3>
        );
      }

      if (/^[-*•]\s+/.test(text)) {
        return <p key={index}>• {text.replace(/^[-*••]\s+/, "")}</p>;
      }

      return <p key={index}>{text}</p>;
    });
  }

  return (
    <main className="app">
      <nav className="navbar">
        <h2>
          Resume<span>IQ</span>
        </h2>
        <span className="nav-tag">SMART RESUME ANALYSIS</span>
      </nav>

      <section className="hero">
        <p className="eyebrow">YOUR CAREER, BETTER PREPARED</p>
        <h1>
          Your next opportunity
          <br />
          starts with <span>the right match.</span>
        </h1>
        <p className="subtitle">
          Upload your resume, add a job description, and discover
          which skills match and which ones you may be missing.
        </p>
      </section>

      <section className="workspace">
        <form className="analyzer" onSubmit={handleSubmit}>
          <h2>Analyze your resume</h2>
          <p className="section-description">
            Start with your PDF resume and target job description.
          </p>

          <label htmlFor="resume">YOUR RESUME</label>
          <div className="upload-box">
            <input
              id="resume"
              type="file"
              accept=".pdf,application/pdf"
              onChange={(event) => {
                setResume(event.target.files?.[0] || null);
                setError("");
              }}
            />
            <p>
              {resume
                ? `Selected: ${resume.name}`
                : "Choose a PDF resume (maximum 5 MB)"}
            </p>
          </div>

          <label htmlFor="jobDescription">JOB DESCRIPTION</label>
          <textarea
            id="jobDescription"
            rows="7"
            placeholder="Paste the job requirements here..."
            value={jobDescription}
            onChange={(event) => setJobDescription(event.target.value)}
          />

          {error && <p className="error">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Analyzing..." : "Analyze Resume →"}
          </button>

          <p className="privacy-note">
            PDF only · Maximum 5 MB · AI-powered feedback
          </p>
        </form>

        <aside className="info-panel">
          <p className="eyebrow">WHAT YOU'LL DISCOVER</p>
          <h2>Know where you stand.</h2>

          <div className="feature">
            <span>01</span>
            <div>
              <h3>Match score</h3>
              <p>See how many recognized job skills match your resume.</p>
            </div>
          </div>

          <div className="feature">
            <span>02</span>
            <div>
              <h3>Matched skills</h3>
              <p>Identify skills found in both the resume and job description.</p>
            </div>
          </div>

          <div className="feature">
            <span>03</span>
            <div>
              <h3>AI resume feedback</h3>
              <p>Get suggestions to improve your resume for your target role.</p>
            </div>
          </div>
        </aside>
      </section>

      {result && (
        <section className="results">
          <p className="eyebrow">ANALYSIS COMPLETE</p>
          <h2>Your resume results</h2>

          <div className="score">
            <strong>{result.matchScore}%</strong>
            <span>Skill match score</span>
          </div>

          <div className="skill-columns">
            <div className="skill-card">
              <h3>✓ Matched skills</h3>
              {result.matchedSkills?.length ? (
                result.matchedSkills.map((skill) => (
                  <span className="skill matched" key={skill}>
                    {skill}
                  </span>
                ))
              ) : (
                <p>No matching skills detected.</p>
              )}
            </div>

            <div className="skill-card">
              <h3>＋ Skills to develop</h3>
              {result.missingSkills?.length ? (
                result.missingSkills.map((skill) => (
                  <span className="skill missing" key={skill}>
                    {skill}
                  </span>
                ))
              ) : (
                <p>No missing listed skills detected.</p>
              )}
            </div>
          </div>

          <p className="disclaimer">
            This keyword-based score is an estimate, not a prediction of hiring success.
          </p>

          <section className="ai-feedback">
            <p className="eyebrow">POWERED BY GEMINI</p>
            <h2>AI Resume Review</h2>

            {result.aiFeedback ? (
              <div className="ai-feedback-content">
                {renderAIFeedback(result.aiFeedback)}
              </div>
            ) : (
              <p>
                AI feedback is currently unavailable.
                You can still use your skill-match results.
              </p>
            )}
          </section>
        </section>
      )}
    </main>
  );
}

export default App;
