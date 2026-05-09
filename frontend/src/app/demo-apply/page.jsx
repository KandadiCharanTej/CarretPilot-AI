"use client";

import { useState } from "react";

export default function DemoApplyPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    skills: "",
  });
  const [file, setFile] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="demo-apply-page">
      <div className="demo-apply-container">
        <div className="demo-header">
          <div className="demo-badge">🤖 AI Automation Target</div>
          <h1>Demo Application Form</h1>
          <p>
            This form is the first target for the CareerPilot Application Agent.
            The AI opens this page, fills all fields, uploads your resume, and clicks Submit — autonomously.
          </p>
        </div>

        {submitted ? (
          <div className="success-state">
            <div className="success-icon">✅</div>
            <h2>Application Received!</h2>
            <p>
              Your application has been successfully submitted. The AI agent will now validate this page and mark the opportunity as <strong>Applied</strong> in your dashboard.
            </p>
            <button
              className="reset-btn"
              onClick={() => {
                setSubmitted(false);
                setFormData({ name: "", email: "", skills: "" });
                setFile(null);
              }}
            >
              Reset Form
            </button>
          </div>
        ) : (
          <form className="demo-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="skills">Skills</label>
              <textarea
                id="skills"
                name="skills"
                placeholder="Python, Machine Learning, React..."
                value={formData.skills}
                onChange={handleChange}
                rows={3}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="resume">Resume (PDF)</label>
              <div className="file-upload">
                <input
                  id="resume"
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setFile(e.target.files[0])}
                />
                <div className="file-label">
                  {file ? `📎 ${file.name}` : "Click to upload resume (PDF)"}
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={submitting}
            >
              {submitting ? (
                <span className="btn-loading">
                  <span className="spinner" /> Submitting...
                </span>
              ) : (
                "Submit Application"
              )}
            </button>
          </form>
        )}

        <div className="ai-indicator">
          <div className="ai-pulse" />
          <span>Application Agent is monitoring this form</span>
        </div>
      </div>

      <style jsx>{`
        .demo-apply-page {
          min-height: 100vh;
          background: radial-gradient(ellipse at top left, #0f0c29, #302b63, #24243e);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          font-family: "Inter", sans-serif;
        }
        .demo-apply-container {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 24px;
          padding: 3rem;
          width: 100%;
          max-width: 560px;
          backdrop-filter: blur(20px);
          box-shadow: 0 32px 80px rgba(0, 0, 0, 0.4);
        }
        .demo-header { text-align: center; margin-bottom: 2.5rem; }
        .demo-badge {
          display: inline-block;
          background: rgba(99, 102, 241, 0.2);
          border: 1px solid rgba(99, 102, 241, 0.4);
          color: #a5b4fc;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          padding: 0.3rem 1rem;
          border-radius: 100px;
          margin-bottom: 1rem;
        }
        .demo-header h1 { font-size: 1.8rem; font-weight: 700; color: #fff; margin-bottom: 0.75rem; }
        .demo-header p { font-size: 0.9rem; color: rgba(255, 255, 255, 0.55); line-height: 1.6; }
        .demo-form { display: flex; flex-direction: column; gap: 1.25rem; }
        .form-group { display: flex; flex-direction: column; gap: 0.4rem; }
        .form-group label { font-size: 0.85rem; font-weight: 600; color: rgba(255, 255, 255, 0.7); }
        .form-group input, .form-group textarea {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 10px;
          padding: 0.85rem 1rem;
          color: #fff;
          font-size: 0.95rem;
        }
        .submit-btn {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border: none;
          border-radius: 12px;
          padding: 1rem;
          color: #fff;
          font-weight: 700;
          cursor: pointer;
        }
        .success-state { text-align: center; }
        .ai-indicator {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 2rem;
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.35);
        }
        .ai-pulse {
          width: 8px;
          height: 8px;
          background: #22c55e;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(34, 197, 94, 0); }
          100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
        }
        .success-icon { font-size: 3rem; margin-bottom: 1rem; }
        .success-state h2 { color: #fff; margin-bottom: 1rem; }
        .success-state p { color: rgba(255,255,255,0.7); margin-bottom: 2rem; line-height: 1.6; }
        .reset-btn {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.2);
          color: rgba(255,255,255,0.8);
          padding: 0.6rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .reset-btn:hover {
          background: rgba(255,255,255,0.05);
          border-color: rgba(255,255,255,0.4);
        }
      `}</style>
    </div>
  );
}
