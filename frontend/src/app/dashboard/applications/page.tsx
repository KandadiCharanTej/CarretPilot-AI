"use client";

import { motion } from "framer-motion";
import { KanbanSquare, Clock, CheckCircle2, XCircle } from "lucide-react";

export default function ApplicationsPage() {
  const columns = [
    { title: "Applied", count: 12, icon: Clock, color: "text-blue-400" },
    { title: "Interview Scheduled", count: 3, icon: KanbanSquare, color: "text-purple-400" },
    { title: "Accepted", count: 1, icon: CheckCircle2, color: "text-emerald-400" },
    { title: "Rejected", count: 4, icon: XCircle, color: "text-gray-500" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <KanbanSquare className="w-6 h-6 text-blue-400" />
          Application Pipeline
        </h1>
        <p className="text-gray-400 text-sm">Track the status of your AI-submitted applications.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {columns.map((col, i) => (
          <div key={i} className="flex flex-col h-[500px] rounded-xl border border-white/5 bg-black/40 backdrop-blur-md p-4">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5">
              <h3 className={`font-semibold flex items-center gap-2 ${col.color}`}>
                <col.icon className="w-4 h-4" />
                {col.title}
              </h3>
              <span className="text-xs font-bold bg-white/10 px-2 py-1 rounded text-white">{col.count}</span>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-3">
              {/* Dummy Card */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-colors cursor-pointer"
              >
                <h4 className="text-sm font-medium text-white mb-1">Company Name</h4>
                <p className="text-xs text-gray-400 mb-2">Role Title</p>
                <div className="text-[10px] text-gray-500 flex justify-between">
                  <span>Applied: 2d ago</span>
                  <span>Auto-Applied</span>
                </div>
              </motion.div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
