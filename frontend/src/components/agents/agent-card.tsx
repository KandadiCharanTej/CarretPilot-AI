"use client";

import { motion } from "framer-motion";
import { Activity, CheckCircle2, CircleDashed } from "lucide-react";

interface Props {
  name: string;
  status: string;
  progress: number;
  icon: React.ReactNode;
  isActive?: boolean;
}

export default function AgentCard({
  name,
  status,
  progress,
  icon,
  isActive = false
}: Props) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`relative p-5 rounded-xl border bg-black/40 backdrop-blur-md overflow-hidden ${
        isActive ? "border-blue-500/40 shadow-[0_0_20px_rgba(37,99,235,0.15)]" : "border-white/5"
      }`}
    >
      {/* Background Glow */}
      {isActive && (
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-600/20 rounded-full blur-[40px]" />
      )}

      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isActive ? "bg-blue-500/10 text-blue-400" : "bg-white/5 text-gray-400"}`}>
            {icon}
          </div>
          <div>
            <h3 className="text-white font-medium text-sm">{name}</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              {isActive ? (
                <Activity className="w-3 h-3 text-blue-400 animate-pulse" />
              ) : (
                <CircleDashed className="w-3 h-3 text-gray-500" />
              )}
              <span className={`text-xs ${isActive ? "text-blue-400" : "text-gray-500"}`}>
                {status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative z-10 mt-6">
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-gray-400">Progress</span>
          <span className="text-white">{progress}%</span>
        </div>
        <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`h-full ${isActive ? "bg-gradient-to-r from-blue-600 to-blue-400" : "bg-gray-600"}`}
          />
        </div>
      </div>
    </motion.div>
  );
}
