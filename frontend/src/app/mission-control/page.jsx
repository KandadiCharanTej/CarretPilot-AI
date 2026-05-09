"use client";

import { useState, useEffect, useRef } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const agentSequence = [
  { id: "manager", name: "Manager Agent", icon: "🎯", desc: "Coordinates workforce" },
  { id: "hunter", name: "Hunter Agent", icon: "🔍", desc: "Searches opportunities" },
  { id: "eligibility", name: "Eligibility Agent", icon: "📊", desc: "Scores & ranks fit" },
  { id: "resume", name: "Resume Agent", icon: "📝", desc: "Optimizes resume" },
  { id: "application", name: "Application Agent", icon: "🚀", desc: "Automates browser" },
  { id: "tracking", name: "Tracking Agent", icon: "📈", desc: "Monitors status" },
];

export default function MissionControlPage() {
  const [profile] = useState({
    name: "Charan Tej",
    email: "charantej@example.com",
    skills: ["Python", "AI", "React"],
    interests: ["ML", "Hackathons"],
    cgpa: 8.2,
  });

  const [agents, setAgents] = useState({
    manager: "idle",
    hunter: "idle",
    eligibility: "idle",
    resume: "idle",
    application: "idle",
    tracking: "idle",
  });

  const [logs, setLogs] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const logsEndRef = useRef(null);
  const eventSourceRef = useRef(null);

  const statusColor = {
    idle: "#475569",
    running: "#3b82f6",
    coordinating: "#f59e0b",
    searching: "#3b82f6",
    ranking: "#8b5cf6",
    applying: "#ec4899",
    done: "#22c55e",
    failed: "#ef4444",
    retrying: "#eab308",
  };

  const statusLabel = {
    idle: "Standby",
    coordinating: "Coordinating...",
    searching: "Searching Web...",
    ranking: "Analyzing Fit...",
    applying: "Automating Browser...",
    done: "Completed ✓",
    failed: "Failed ✗",
    running: "Processing...",
    retrying: "Retrying ↻",
  };

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // Polling for statuses since SSE only gives logs
  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(async () => {
        try {
          const res = await fetch(`${API}/agents/status`);
          const data = await res.json();
          
          setAgents(prev => ({
            ...prev,
            manager: data.agents?.manager || "idle",
            hunter: data.agents?.hunter || "idle",
            eligibility: data.agents?.eligibility || "idle",
            application: data.agents?.application || "idle",
            // Mock resume and tracking for UI completeness based on logs or application status
            resume: data.agents?.eligibility === "done" && data.agents?.application === "idle" ? "running" : (data.agents?.application !== "idle" ? "done" : "idle"),
            tracking: data.agents?.application === "done" ? "done" : "idle"
          }));

          if (!data.is_running && isRunning) {
            setIsRunning(false);
            setResult(data.result);
            setError(data.error);
            if (!data.error && data.result) {
              setSuccess(true);
            }
          }
        } catch {}
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const startWorkflow = async () => {
    setIsRunning(true);
    setResult(null);
    setError(null);
    setSuccess(false);
    setLogs([]);
    setAgents({ manager: "idle", hunter: "idle", eligibility: "idle", resume: "idle", application: "idle", tracking: "idle" });

    // Close existing SSE
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    try {
      await fetch(`${API}/agents/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      // Start SSE for LIVE logs
      const source = new EventSource(`${API}/agents/logs/stream`);
      eventSourceRef.current = source;

      source.onmessage = (event) => {
        const newLog = JSON.parse(event.data);
        setLogs((prev) => [...prev, newLog]);
        
        // Disconnect if workflow complete
        if (newLog.message.includes("Workflow complete")) {
          source.close();
        }
      };

      source.onerror = () => {
        source.close();
      };

    } catch (e) {
      setError("Could not connect to backend.");
      setIsRunning(false);
    }
  };

  const getLogTime = (timestamp) => {
    if (!timestamp) return new Date().toLocaleTimeString('en-US', { hour12: false });
    return new Date(timestamp * 1000).toLocaleTimeString('en-US', { hour12: false });
  };

  return (
    <div className="mission-control">
      <div className="mc-header">
        <div className="glow-badge">🔴 LIVE SOC</div>
        <h1>AI Mission Control</h1>
        <p>Palantir-inspired operator console. Watching agents in real-time.</p>
      </div>

      <div className="mc-layout">
        
        {/* Left Column: Workflow Graph */}
        <div className="mc-column graph-column">
          <div className="panel-title">Neural Workflow Graph</div>
          <div className="workflow-graph">
            {agentSequence.map((agent, index) => {
              const state = agents[agent.id];
              const color = statusColor[state] || statusColor.idle;
              const isRunningState = state !== "idle" && state !== "done" && state !== "failed";
              
              return (
                <div key={agent.id} className="graph-node-wrapper">
                  <div className={`graph-node ${isRunningState ? 'node-running' : ''}`} style={{ borderColor: color, boxShadow: isRunningState ? `0 0 20px ${color}40` : 'none' }}>
                    <div className="node-icon" style={{ color: color }}>{agent.icon}</div>
                    <div className="node-info">
                      <div className="node-name">{agent.name}</div>
                      <div className="node-desc">{agent.desc}</div>
                    </div>
                    <div className="node-status" style={{ color: color }}>
                      {isRunningState && <span className="typing-dot" style={{ backgroundColor: color }}></span>}
                      {statusLabel[state] || "Standby"}
                    </div>
                  </div>
                  {index < agentSequence.length - 1 && (
                    <div className={`graph-edge ${state === 'done' ? 'edge-active' : ''}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Logs & Control */}
        <div className="mc-column">
          
          <div className="control-panel">
            <button
              onClick={startWorkflow}
              disabled={isRunning}
              className={`launch-btn ${isRunning ? 'btn-running' : ''}`}
            >
              {isRunning ? (
                <>
                  <span className="pulse-ring"></span>
                  SYSTEM AUTONOMOUS
                </>
              ) : (
                "🚀 LAUNCH AI WORKFLOW"
              )}
            </button>
            <a href="/demo-apply" className="demo-link" target="_blank" rel="noopener">
              [ Open Browser Target → ]
            </a>
          </div>

          <div className="live-logs-panel">
            <div className="panel-header">
              <span>&gt; TERMINAL STREAM</span>
              {isRunning && <span className="live-indicator">● LIVE</span>}
            </div>
            <div className="logs-container">
              {logs.length === 0 && (
                <div className="empty-log">Awaiting command execution...</div>
              )}
              {logs.map((log, i) => (
                <div key={i} className={`log-line ${log.message.includes('❌') ? 'log-error' : ''} ${log.message.includes('↻') ? 'log-retry' : ''}`}>
                  <span className="log-time">[{getLogTime(log.time)}]</span>
                  <span className="log-agent">{log.agent}</span>
                  <span className="log-arrow">→</span>
                  <span className="log-msg">{log.message}</span>
                </div>
              ))}
              <div ref={logsEndRef} />
            </div>
          </div>

          <div className="timeline-panel">
            <div className="panel-title">Execution Timeline</div>
            <ul className="timeline-list">
              <li className={agents.hunter === "done" ? "done" : ""}>
                <span className="checkbox">{agents.hunter === "done" ? "✓" : "○"}</span> Opportunities Found
              </li>
              <li className={agents.eligibility === "done" ? "done" : ""}>
                <span className="checkbox">{agents.eligibility === "done" ? "✓" : "○"}</span> Eligibility Scored
              </li>
              <li className={agents.resume === "done" ? "done" : ""}>
                <span className="checkbox">{agents.resume === "done" ? "✓" : "○"}</span> Resume Optimized
              </li>
              <li className={agents.application === "done" || agents.application === "applying" ? "done" : ""}>
                <span className="checkbox">{agents.application === "done" || agents.application === "applying" ? "✓" : "○"}</span> Browser Launched
              </li>
              <li className={agents.application === "done" ? "done" : ""}>
                <span className="checkbox">{agents.application === "done" ? "✓" : "○"}</span> Application Submitted
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Success Overlay */}
      {success && (
        <div className="success-overlay">
          <div className="success-modal">
            <div className="success-anim">✅</div>
            <h2>Mission Accomplished</h2>
            <p>Application successfully submitted autonomously.</p>
            <button className="close-btn" onClick={() => setSuccess(false)}>Dismiss</button>
          </div>
        </div>
      )}

      {error && (
        <div className="error-toast">
          ❌ SYSTEM ERROR: {error}
        </div>
      )}

      <style jsx>{`
        .mission-control {
          min-height: 100vh;
          background: #050505;
          background-image: 
            radial-gradient(circle at 15% 50%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 85% 30%, rgba(139, 92, 246, 0.08) 0%, transparent 50%),
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 100% 100%, 100% 100%, 30px 30px, 30px 30px;
          color: #e2e8f0;
          font-family: 'JetBrains Mono', 'Fira Code', monospace;
          padding: 2rem;
        }

        .mc-header { text-align: center; margin-bottom: 3rem; }
        .glow-badge {
          display: inline-block;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.4);
          color: #fca5a5;
          padding: 4px 12px;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: bold;
          letter-spacing: 2px;
          margin-bottom: 1rem;
          animation: pulse-red 2s infinite;
        }
        @keyframes pulse-red {
          0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
          70% { box-shadow: 0 0 0 6px rgba(239, 68, 68, 0); }
          100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
        .mc-header h1 { font-family: 'Inter', sans-serif; font-size: 2.5rem; font-weight: 900; text-transform: uppercase; letter-spacing: 4px; background: linear-gradient(to right, #fff, #94a3b8); -webkit-background-clip: text; color: transparent; margin-bottom: 0.5rem; }
        .mc-header p { color: #64748b; font-size: 0.9rem; }

        .mc-layout { display: grid; grid-template-columns: 1fr 1.2fr; gap: 3rem; max-width: 1200px; margin: 0 auto; }
        
        .panel-title { font-size: 0.8rem; text-transform: uppercase; letter-spacing: 2px; color: #94a3b8; margin-bottom: 1.5rem; border-bottom: 1px solid #1e293b; padding-bottom: 0.5rem; }

        /* Graph Styles */
        .workflow-graph { display: flex; flex-direction: column; align-items: center; }
        .graph-node-wrapper { display: flex; flex-direction: column; align-items: center; width: 100%; max-width: 400px; }
        .graph-node {
          width: 100%; background: rgba(15, 23, 42, 0.6); border: 1px solid #1e293b; border-radius: 8px; padding: 1rem; display: flex; align-items: center; gap: 1rem; transition: all 0.3s ease; backdrop-filter: blur(10px);
        }
        .node-running {
          background: rgba(30, 58, 138, 0.2);
          transform: scale(1.02);
        }
        .node-icon { font-size: 1.5rem; }
        .node-info { flex: 1; }
        .node-name { font-weight: bold; font-size: 0.95rem; color: #f8fafc; font-family: 'Inter', sans-serif; }
        .node-desc { font-size: 0.75rem; color: #64748b; }
        .node-status { font-size: 0.75rem; font-weight: bold; display: flex; align-items: center; gap: 6px; text-transform: uppercase; }
        
        .typing-dot { width: 6px; height: 6px; border-radius: 50%; display: inline-block; animation: blink 1s infinite; }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }

        .graph-edge { width: 2px; height: 30px; background: #1e293b; margin: 4px 0; position: relative; overflow: hidden; }
        .edge-active { background: #22c55e; box-shadow: 0 0 8px #22c55e; }
        .edge-active::after {
          content: ''; position: absolute; top: -100%; left: 0; width: 100%; height: 100%; background: linear-gradient(to bottom, transparent, #fff, transparent); animation: flow 1s linear infinite;
        }
        @keyframes flow { 100% { top: 100%; } }

        /* Right Column Styles */
        .control-panel { display: flex; flex-direction: column; align-items: center; gap: 1rem; margin-bottom: 2rem; }
        .launch-btn {
          width: 100%; padding: 1.25rem; background: #0f172a; border: 1px solid #3b82f6; border-radius: 4px; color: #60a5fa; font-family: 'JetBrains Mono', monospace; font-size: 1.1rem; font-weight: bold; letter-spacing: 2px; cursor: pointer; transition: all 0.2s; position: relative; overflow: hidden;
        }
        .launch-btn:hover:not(:disabled) { background: #1e3a8a; color: #fff; box-shadow: 0 0 20px rgba(59, 130, 246, 0.4); }
        .btn-running { background: #064e3b; border-color: #10b981; color: #34d399; cursor: not-allowed; display: flex; justify-content: center; align-items: center; gap: 12px; }
        
        .pulse-ring { width: 12px; height: 12px; background: #34d399; border-radius: 50%; animation: pulse-green 1.5s infinite; }
        @keyframes pulse-green { 0% { box-shadow: 0 0 0 0 rgba(52, 211, 153, 0.6); } 70% { box-shadow: 0 0 0 10px rgba(52, 211, 153, 0); } 100% { box-shadow: 0 0 0 0 rgba(52, 211, 153, 0); } }

        .demo-link { font-size: 0.8rem; color: #64748b; text-decoration: none; transition: color 0.2s; }
        .demo-link:hover { color: #94a3b8; }

        .live-logs-panel { background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; margin-bottom: 2rem; overflow: hidden; }
        .panel-header { padding: 0.75rem 1rem; background: #020617; border-bottom: 1px solid #1e293b; font-size: 0.75rem; color: #64748b; display: flex; justify-content: space-between; align-items: center; }
        .live-indicator { color: #ef4444; font-weight: bold; animation: blink 1s infinite; }
        .logs-container { padding: 1rem; height: 250px; overflow-y: auto; font-size: 0.8rem; line-height: 1.6; }
        .logs-container::-webkit-scrollbar { width: 6px; }
        .logs-container::-webkit-scrollbar-thumb { background: #334155; border-radius: 3px; }
        .empty-log { color: #334155; font-style: italic; }
        .log-line { margin-bottom: 0.5rem; display: flex; gap: 0.5rem; }
        .log-time { color: #64748b; }
        .log-agent { color: #3b82f6; font-weight: bold; }
        .log-arrow { color: #475569; }
        .log-msg { color: #cbd5e1; }
        .log-error .log-msg { color: #f87171; }
        .log-retry .log-msg { color: #facc15; }

        .timeline-panel { background: rgba(15, 23, 42, 0.4); border: 1px solid #1e293b; border-radius: 8px; padding: 1.5rem; }
        .timeline-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.75rem; }
        .timeline-list li { color: #64748b; font-size: 0.85rem; display: flex; align-items: center; gap: 10px; transition: color 0.3s; }
        .timeline-list li.done { color: #f8fafc; }
        .checkbox { color: #3b82f6; font-weight: bold; font-size: 1rem; }
        .timeline-list li.done .checkbox { color: #22c55e; }

        .success-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(5px); display: flex; align-items: center; justify-content: center; z-index: 50; animation: fadeIn 0.5s ease; }
        .success-modal { background: #0f172a; border: 1px solid #22c55e; border-radius: 12px; padding: 3rem; text-align: center; max-width: 400px; box-shadow: 0 0 40px rgba(34, 197, 94, 0.2); }
        .success-anim { font-size: 4rem; margin-bottom: 1rem; animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .success-modal h2 { font-family: 'Inter', sans-serif; color: #f8fafc; margin-bottom: 0.5rem; }
        .success-modal p { color: #94a3b8; font-size: 0.9rem; margin-bottom: 2rem; }
        .close-btn { background: #1e293b; border: none; color: #f8fafc; padding: 0.75rem 2rem; border-radius: 4px; cursor: pointer; transition: background 0.2s; }
        .close-btn:hover { background: #334155; }

        .error-toast { position: fixed; bottom: 2rem; right: 2rem; background: rgba(127, 29, 29, 0.9); border: 1px solid #ef4444; color: #fca5a5; padding: 1rem 1.5rem; border-radius: 8px; backdrop-filter: blur(10px); z-index: 50; }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes popIn { 0% { transform: scale(0.5); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
      `}</style>
    </div>
  );
}
