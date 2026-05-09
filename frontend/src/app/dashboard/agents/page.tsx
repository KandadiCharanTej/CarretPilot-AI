"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Network, 
  Server, 
  PlayCircle, 
  StopCircle, 
  Bot, 
  Search, 
  FileCheck, 
  Send, 
  FileText,
  Activity,
  Terminal,
  Zap,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";

interface AgentStatus {
  manager: string;
  hunter: string;
  eligibility: string;
  resume: string;
  application: string;
}

interface LogEntry {
  agent: string;
  message: string;
  timestamp?: string;
}

export default function MissionControl() {
  const [isRunning, setIsRunning] = useState(false);
  const [agents, setAgents] = useState<AgentStatus>({
    manager: "idle",
    hunter: "idle",
    eligibility: "idle",
    resume: "idle",
    application: "idle",
  });
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const logEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logs
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // Poll status
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("http://localhost:8000/agents/status");
        const data = await res.json();
        setAgents(data.agents);
        setIsRunning(data.is_running);
        if (data.logs) setLogs(data.logs);
      } catch (err) {
        console.error("Failed to fetch status:", err);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // SSE for live logs
  useEffect(() => {
    if (isRunning) {
      const eventSource = new EventSource("http://localhost:8000/agents/logs/stream");
      eventSource.onmessage = (event) => {
        const newLog = JSON.parse(event.data);
        setLogs((prev) => [...prev, newLog]);
      };
      return () => eventSource.close();
    }
  }, [isRunning]);

  const startWorkflow = async () => {
    try {
      setIsRunning(true);
      setLogs([{ agent: "System", message: "🚀 Initializing CareerPilot Swarm..." }]);
      const res = await fetch("http://localhost:8000/agents/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Student",
          email: "student@example.com",
          skills: ["React", "Node.js", "AI"],
          interests: ["Frontend", "AI Internships"],
          cgpa: 8.5
        }),
      });
      const data = await res.json();
      toast.success(data.message);
    } catch (err) {
      toast.error("Failed to start workflow");
      setIsRunning(false);
    }
  };

  const agentConfig = [
    { id: "manager", name: "Manager Agent", role: "Orchestrator", icon: Server, color: "blue" },
    { id: "hunter", name: "Hunter Agent", role: "Opportunity Scraper", icon: Search, color: "purple" },
    { id: "eligibility", name: "Eligibility Agent", role: "Ranker & Analyzer", icon: FileCheck, color: "emerald" },
    { id: "resume", name: "Resume Agent", role: "ATS Optimizer", icon: FileText, color: "yellow" },
    { id: "application", name: "Application Agent", role: "Automation Bot", icon: Send, color: "orange" },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-black/20 p-6 rounded-2xl border border-white/5 backdrop-blur-sm">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3 tracking-tighter">
            <Zap className="w-8 h-8 text-yellow-400 fill-yellow-400" />
            MISSION CONTROL
          </h1>
          <p className="text-gray-400 text-sm mt-1 flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-500" />
            Autonomous Agent Workforce Live Stream
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={startWorkflow}
            disabled={isRunning}
            className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${
              isRunning 
                ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 cursor-not-allowed" 
                : "bg-blue-600 text-white hover:bg-blue-500 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)]"
            }`}
          >
            {isRunning ? (
              <>
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Bot className="w-5 h-5" />
                </motion.div>
                Swarm Active
              </>
            ) : (
              <>
                <PlayCircle className="w-5 h-5" />
                Launch Workflow
              </>
            )}
          </button>
          <button className="px-6 py-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl font-bold hover:bg-red-500/20 transition-all">
            <StopCircle className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Agent Visualization */}
        <div className="lg:col-span-8 space-y-6">
          <div className="relative p-10 rounded-3xl border border-white/5 bg-black/40 backdrop-blur-xl min-h-[500px] flex items-center justify-center overflow-hidden">
            {/* Animated Background Mesh */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_0,transparent_70%)]" />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative z-10 w-full max-w-4xl mx-auto">
              {/* Manager Column */}
              <div className="flex flex-col justify-center">
                <AgentNode 
                  config={agentConfig[0]} 
                  status={agents.manager} 
                  isActive={isRunning && agents.manager !== "idle"} 
                />
              </div>

              {/* Workers Column */}
              <div className="flex flex-col gap-12 justify-center">
                <AgentNode 
                  config={agentConfig[1]} 
                  status={agents.hunter} 
                  isActive={isRunning && agents.hunter !== "idle"} 
                />
                <AgentNode 
                  config={agentConfig[2]} 
                  status={agents.eligibility} 
                  isActive={isRunning && agents.eligibility !== "idle"} 
                />
              </div>

              {/* Output Column */}
              <div className="flex flex-col gap-12 justify-center">
                <AgentNode 
                  config={agentConfig[3]} 
                  status={agents.resume} 
                  isActive={isRunning && agents.resume !== "idle"} 
                />
                <AgentNode 
                  config={agentConfig[4]} 
                  status={agents.application} 
                  isActive={isRunning && agents.application !== "idle"} 
                />
              </div>
            </div>
            
            {/* Animated Connection Paths */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30" viewBox="0 0 800 500">
              <defs>
                <linearGradient id="grad-blue" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
                  <stop offset="50%" stopColor="#3b82f6" stopOpacity="1" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Manager to Hunter */}
              <motion.path 
                d="M 200,250 C 300,250 300,150 400,150" 
                stroke="url(#grad-blue)" 
                strokeWidth="2" 
                fill="none"
                animate={{ strokeDashoffset: [100, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                strokeDasharray="10,10"
              />
              {/* Manager to Eligibility */}
              <motion.path 
                d="M 200,250 C 300,250 300,350 400,350" 
                stroke="url(#grad-blue)" 
                strokeWidth="2" 
                fill="none"
                animate={{ strokeDashoffset: [100, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                strokeDasharray="10,10"
              />
            </svg>
          </div>
        </div>

        {/* Right: Live Logs */}
        <div className="lg:col-span-4 flex flex-col h-[500px] md:h-auto">
          <div className="flex-1 rounded-3xl border border-white/5 bg-black/60 backdrop-blur-xl flex flex-col overflow-hidden">
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-gray-400" />
                <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">Live Execution Log</span>
              </div>
              {isRunning && (
                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-[10px] text-emerald-500 font-bold uppercase">Streaming</span>
                </div>
              )}
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-[13px]">
              <AnimatePresence initial={false}>
                {logs.length === 0 ? (
                  <div className="text-gray-600 flex flex-col items-center justify-center h-full opacity-50">
                    <Bot className="w-12 h-12 mb-2" />
                    <p>System ready. Awaiting instructions.</p>
                  </div>
                ) : (
                  logs.map((log, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex gap-3 items-start group"
                    >
                      <span className={`mt-1 text-[10px] px-1.5 py-0.5 rounded border font-bold ${
                        log.agent === 'Manager Agent' ? 'text-blue-400 border-blue-500/20 bg-blue-500/5' :
                        log.agent === 'Hunter Agent' ? 'text-purple-400 border-purple-500/20 bg-purple-500/5' :
                        log.agent === 'Eligibility Agent' ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' :
                        log.agent === 'Application Agent' ? 'text-orange-400 border-orange-500/20 bg-orange-500/5' :
                        'text-gray-400 border-white/10 bg-white/5'
                      }`}>
                        {log.agent.split(' ')[0]}
                      </span>
                      <p className="text-gray-300 group-hover:text-white transition-colors leading-relaxed">
                        {log.message}
                      </p>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
              <div ref={logEndRef} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AgentNode({ config, status, isActive }: { config: any, status: string, isActive: boolean }) {
  const Icon = config.icon;
  
  const statusColors: Record<string, string> = {
    idle: "border-white/5 bg-white/5 text-gray-500 opacity-50",
    searching: "border-purple-500/50 bg-purple-500/20 text-purple-400 shadow-[0_0_30px_rgba(168,85,247,0.2)]",
    ranking: "border-emerald-500/50 bg-emerald-500/20 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.2)]",
    coordinating: "border-blue-500/50 bg-blue-500/20 text-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]",
    applying: "border-orange-500/50 bg-orange-500/20 text-orange-400 shadow-[0_0_30px_rgba(249,115,22,0.2)]",
    done: "border-emerald-500 bg-emerald-500/20 text-emerald-400",
    failed: "border-red-500 bg-red-500/20 text-red-400",
  };

  return (
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      className={`p-6 rounded-3xl border-2 ${statusColors[status] || statusColors.idle} backdrop-blur-md flex flex-col items-center text-center relative transition-all duration-500`}
    >
      {isActive && (
        <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
        </span>
      )}
      
      <div className={`p-4 rounded-2xl mb-4 ${isActive ? 'bg-white/10 animate-pulse' : 'bg-white/5'}`}>
        <Icon className="w-10 h-10" />
      </div>
      
      <h3 className="font-black text-sm text-white uppercase tracking-tighter">{config.name}</h3>
      <p className="text-[10px] opacity-60 uppercase tracking-widest font-bold mt-1">{config.role}</p>
      
      <div className="mt-4 px-3 py-1 rounded-full bg-black/40 border border-white/10 text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
        {status === 'idle' ? <AlertCircle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
        {status}
      </div>
    </motion.div>
  );
}
