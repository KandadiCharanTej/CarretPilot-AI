"use client";

import AgentCard from "@/components/agents/agent-card";
import { Search, FileText, Send, BellRing, ChevronRight, Play, CheckCircle2, AlertCircle, RefreshCw, Network, Code, TerminalSquare } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { api } from "@/services/api";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function DashboardPage() {
  const [profile] = useState({
    name: "Commander",
    email: "commander@careerpilot.ai",
    skills: ["Python", "AI", "React", "Next.js"],
    interests: ["Software Engineering", "AI Internships"],
    cgpa: 8.5,
  });

  const [agents, setAgents] = useState({
    manager: "idle",
    hunter: "idle",
    eligibility: "idle",
    resume: "idle",
    application: "idle",
    tracking: "idle",
  });

  const [logs, setLogs] = useState<{ time: number; agent: string; message: string }[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  // Scroll to bottom of logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // Polling for statuses since SSE only gives logs
  useEffect(() => {
    let interval: NodeJS.Timeout;
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
            resume: data.agents?.eligibility === "done" && data.agents?.application === "idle" ? "running" : (data.agents?.application !== "idle" ? "done" : "idle"),
            tracking: data.agents?.application === "done" ? "done" : "idle"
          }));

          if (!data.is_running && isRunning) {
            setIsRunning(false);
            if (!data.error && data.result) {
              setSuccess(true);
            }
            if (data.error) {
              setError(data.error);
            }
          }
        } catch (err) {
          console.error(err);
        }
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const startWorkflow = async () => {
    setIsRunning(true);
    setSuccess(false);
    setError(null);
    setLogs([]);
    setAgents({ manager: "idle", hunter: "idle", eligibility: "idle", resume: "idle", application: "idle", tracking: "idle" });

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    try {
      await fetch(`${API}/agents/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      const source = new EventSource(`${API}/agents/logs/stream`);
      eventSourceRef.current = source;

      source.onmessage = (event) => {
        const newLog = JSON.parse(event.data);
        setLogs((prev) => [...prev, newLog]);
        
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

  const getLogTime = (timestamp?: number) => {
    if (!timestamp) return new Date().toLocaleTimeString('en-US', { hour12: false });
    return new Date(timestamp * 1000).toLocaleTimeString('en-US', { hour12: false });
  };

  const getAgentStatus = (state: string) => {
    if (state === "idle") return { text: "Standby", progress: 0 };
    if (state === "searching" || state === "coordinating" || state === "ranking") return { text: "Processing...", progress: 45 };
    if (state === "applying") return { text: "Automating...", progress: 80 };
    if (state === "done") return { text: "Completed", progress: 100 };
    if (state === "running") return { text: "Running...", progress: 50 };
    return { text: "Idle", progress: 0 };
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            Welcome back, Commander
            {isRunning && <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse ml-2" />}
          </h1>
          <p className="text-gray-400 text-sm">Your autonomous career workforce is ready to scan for opportunities.</p>
        </div>
        
        <button 
          onClick={startWorkflow}
          disabled={isRunning}
          className={`px-6 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-all ${
            isRunning 
              ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 cursor-not-allowed' 
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5'
          }`}
        >
          {isRunning ? (
            <><RefreshCw className="w-4 h-4 animate-spin" /> System Running...</>
          ) : (
            <><Play className="w-4 h-4 fill-current" /> Launch AI Workflow</>
          )}
        </button>
      </div>

      {/* Agents Grid */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            {isRunning ? <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> : <span className="w-2 h-2 rounded-full bg-gray-500" />}
            Live Agent Swarm
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <AgentCard
            name="Opportunity Hunter"
            status={getAgentStatus(agents.hunter).text}
            progress={getAgentStatus(agents.hunter).progress}
            icon={<Search className="w-5 h-5" />}
            isActive={agents.hunter !== "idle" && agents.hunter !== "done"}
          />
          <AgentCard
            name="Eligibility & Resume"
            status={getAgentStatus(agents.eligibility === 'done' ? agents.resume : agents.eligibility).text}
            progress={getAgentStatus(agents.eligibility === 'done' ? agents.resume : agents.eligibility).progress}
            icon={<FileText className="w-5 h-5" />}
            isActive={(agents.eligibility !== "idle" && agents.eligibility !== "done") || (agents.resume !== "idle" && agents.resume !== "done")}
          />
          <AgentCard
            name="Application Agent"
            status={getAgentStatus(agents.application).text}
            progress={getAgentStatus(agents.application).progress}
            icon={<Send className="w-5 h-5" />}
            isActive={agents.application !== "idle" && agents.application !== "done"}
          />
          <AgentCard
            name="Reminder Agent"
            status={getAgentStatus(agents.tracking).text}
            progress={getAgentStatus(agents.tracking).progress}
            icon={<BellRing className="w-5 h-5" />}
            isActive={agents.tracking !== "idle" && agents.tracking !== "done"}
          />
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Execution Pipeline (Terminal Stream) */}
        <section className="lg:col-span-2 rounded-xl border border-white/5 bg-black/40 backdrop-blur-md overflow-hidden flex flex-col h-[400px]">
          <div className="p-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <TerminalSquare className="w-4 h-4 text-gray-400" />
              Terminal Stream
            </h2>
            {isRunning && <span className="text-xs text-emerald-400 animate-pulse font-mono tracking-wider">● LIVE</span>}
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto font-mono text-sm bg-[#050505]">
            {logs.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-2">
                <Code className="w-6 h-6 opacity-50" />
                <p>Awaiting command execution...</p>
              </div>
            ) : (
              <div className="space-y-2">
                {logs.map((log, i) => (
                  <div key={i} className={`flex gap-3 leading-relaxed ${log.message.includes('❌') ? 'text-red-400' : 'text-gray-300'}`}>
                    <span className="text-gray-500 shrink-0">[{getLogTime(log.time)}]</span>
                    <span className="text-blue-400 font-medium shrink-0">{log.agent} <span className="text-gray-600">→</span></span>
                    <span className="break-words">{log.message}</span>
                  </div>
                ))}
                <div ref={logsEndRef} />
              </div>
            )}
          </div>
        </section>

        {/* Opportunity Feed */}
        <section className="rounded-xl border border-white/5 bg-black/40 backdrop-blur-md p-6 flex flex-col h-[400px]">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center justify-between">
            Top Matches
            <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full border border-blue-500/20">Live</span>
          </h2>
          
          <div className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
            {[
              { title: "Software Engineer Intern", company: "TechCorp Inc.", location: "Remote", match: 98, tags: ["React", "Node.js"] },
              { title: "AI/ML Intern", company: "NeuralSys", location: "San Francisco", match: 95, tags: ["Python", "TensorFlow"] },
              { title: "Frontend Developer", company: "WebFlow Studio", location: "Remote", match: 92, tags: ["Next.js", "Tailwind"] },
              { title: "Data Science Intern", company: "DataTech", location: "New York", match: 88, tags: ["Python", "SQL"] }
            ].map((job, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-3.5 rounded-lg bg-white/[0.03] border border-white/5 hover:border-blue-500/30 transition-all hover:bg-white/[0.05] group cursor-pointer"
              >
                <div className="flex justify-between items-start mb-1.5">
                  <h3 className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">{job.title}</h3>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded border border-emerald-400/20">{job.match}% Match</span>
                </div>
                <p className="text-xs text-gray-400 mb-2.5">{job.company} • {job.location}</p>
                <div className="flex gap-1.5">
                  {job.tags.map(tag => (
                    <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-gray-300">{tag}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* AI Career Insights */}
        <section className="lg:col-span-3 rounded-xl border border-white/5 bg-black/40 backdrop-blur-md p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span className="text-purple-400">✨</span> AI Career Insights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-gradient-to-br from-purple-500/10 to-blue-500/5 border border-purple-500/10">
              <h3 className="text-sm font-medium text-purple-300 mb-2">Skill Gap Analysis</h3>
              <p className="text-xs text-gray-400 leading-relaxed">You have strong React skills, but many top matches require <strong>TypeScript</strong>. Consider building a small TS project.</p>
            </div>
            <div className="p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-indigo-500/5 border border-blue-500/10">
              <h3 className="text-sm font-medium text-blue-300 mb-2">Resume Optimization</h3>
              <p className="text-xs text-gray-400 leading-relaxed">Your resume was optimized 3 times today. Adding quantifiable metrics to your recent hackathon project increased your score by 15%.</p>
            </div>
            <div className="p-4 rounded-lg bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/10">
              <h3 className="text-sm font-medium text-emerald-300 mb-2">Interview Prep</h3>
              <p className="text-xs text-gray-400 leading-relaxed">2 applications are pending. Based on TechCorp's patterns, prepare for system design questions regarding scalable web sockets.</p>
            </div>
          </div>
        </section>
      </div>

      {/* Success Modal */}
      {success && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#0f172a] border border-emerald-500/30 p-8 rounded-2xl max-w-sm w-full mx-4 shadow-[0_0_40px_rgba(34,197,94,0.15)] text-center"
          >
            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Mission Accomplished</h2>
            <p className="text-gray-400 text-sm mb-6">Your autonomous agent workforce has successfully completed the application cycle.</p>
            <button 
              onClick={() => setSuccess(false)}
              className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors border border-white/10"
            >
              Dismiss
            </button>
          </motion.div>
        </div>
      )}

      {/* Error Toast */}
      {error && (
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-6 right-6 z-50 bg-red-950/90 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 backdrop-blur-md"
        >
          <AlertCircle className="w-5 h-5 text-red-400" />
          <p className="text-sm">{error}</p>
          <button onClick={() => setError(null)} className="ml-2 text-red-400 hover:text-red-300">✕</button>
        </motion.div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `}</style>
    </div>
  );
}
