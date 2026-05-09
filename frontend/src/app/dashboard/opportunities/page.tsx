"use client";

import { motion } from "framer-motion";
import { Target, Search, Filter, ExternalLink, Zap } from "lucide-react";

export default function OpportunitiesPage() {
  const jobs = [
    { title: "AI Research Intern", company: "DeepMind", match: 98, type: "Internship", location: "Remote" },
    { title: "Software Engineer Intern", company: "Google", match: 95, type: "Internship", location: "Bangalore" },
    { title: "Frontend Developer", company: "Stripe", match: 92, type: "Full-time", location: "Remote" },
    { title: "Machine Learning Engineer", company: "OpenAI", match: 89, type: "Full-time", location: "San Francisco" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <Target className="w-6 h-6 text-blue-400" />
          Opportunity Feed
        </h1>
        <p className="text-gray-400 text-sm">Discover and filter opportunities curated by your AI agents.</p>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search opportunities..." 
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50"
          />
        </div>
        <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white flex items-center gap-2 hover:bg-white/10 transition-colors">
          <Filter className="w-4 h-4" /> Filters
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {jobs.map((job, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={i} 
            className="p-5 rounded-xl border border-white/5 bg-black/40 backdrop-blur-md hover:border-blue-500/30 transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">{job.title}</h3>
                <p className="text-sm text-gray-400">{job.company} • {job.location}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded border border-emerald-400/20 flex items-center gap-1">
                  <Zap className="w-3 h-3" /> {job.match}% Match
                </span>
                <span className="text-[10px] text-gray-500 px-2 py-1 bg-white/5 rounded">{job.type}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors">
                Auto Apply
              </button>
              <button className="px-3 py-2 border border-white/10 hover:bg-white/5 rounded-lg text-gray-400 transition-colors">
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
