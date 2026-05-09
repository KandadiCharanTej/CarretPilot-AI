"use client";

import { motion } from "framer-motion";
import { LineChart as ChartIcon, TrendingUp, Lightbulb } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <ChartIcon className="w-6 h-6 text-blue-400" />
          AI Career Insights
        </h1>
        <p className="text-gray-400 text-sm">Data-driven analysis of your career trajectory and market trends.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 md:col-span-2 p-6 rounded-xl border border-white/5 bg-black/40 backdrop-blur-md min-h-[300px]">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" /> Application Activity
          </h2>
          <div className="h-48 flex items-end gap-2 mt-8">
            {/* Dummy Bar Chart */}
            {[40, 25, 60, 30, 85, 45, 70].map((height, i) => (
              <div key={i} className="flex-1 bg-blue-500/20 hover:bg-blue-500/40 transition-colors rounded-t-sm relative group">
                <div 
                  className="absolute bottom-0 w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-sm"
                  style={{ height: `${height}%` }}
                />
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  {height}
                </span>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-4">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 rounded-xl border border-white/5 bg-gradient-to-br from-purple-500/10 to-transparent">
            <h2 className="text-lg font-semibold text-purple-400 mb-2 flex items-center gap-2">
              <Lightbulb className="w-5 h-5" /> Skill Recommendations
            </h2>
            <ul className="space-y-3 mt-4">
              <li className="text-sm text-gray-300 flex justify-between items-center">
                <span>TypeScript</span>
                <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded">+High Demand</span>
              </li>
              <li className="text-sm text-gray-300 flex justify-between items-center">
                <span>GraphQL</span>
                <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded">+Trending</span>
              </li>
              <li className="text-sm text-gray-300 flex justify-between items-center">
                <span>Docker</span>
                <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded">+Required</span>
              </li>
            </ul>
          </div>
          
          <div className="p-6 rounded-xl border border-white/5 bg-black/40 backdrop-blur-md">
            <h2 className="text-lg font-semibold text-white mb-2">Market Match</h2>
            <div className="flex items-center justify-center py-6">
               <div className="w-32 h-32 rounded-full border-8 border-white/10 flex items-center justify-center relative">
                 <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                   <circle cx="60" cy="60" r="56" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-blue-500" strokeDasharray="351" strokeDashoffset="70" />
                 </svg>
                 <span className="text-3xl font-bold text-white">80%</span>
               </div>
            </div>
            <p className="text-xs text-center text-gray-400">Profile matches current market demands.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
