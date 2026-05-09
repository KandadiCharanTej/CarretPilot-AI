"use client";

import { motion } from "framer-motion";
import { FileEdit, Upload, Sparkles, FileText } from "lucide-react";

export default function ResumePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <FileEdit className="w-6 h-6 text-blue-400" />
          Resume Studio
        </h1>
        <p className="text-gray-400 text-sm">AI-powered resume optimization and cover letter generation.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl border border-white/5 bg-black/40 backdrop-blur-md">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Current Master Resume</h2>
            <button className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-white transition-colors flex items-center gap-2">
              <Upload className="w-4 h-4" /> Upload New
            </button>
          </div>
          
          <div className="aspect-[1/1.4] w-full max-w-sm mx-auto bg-white/5 border border-white/10 rounded-lg flex items-center justify-center p-8">
             <div className="text-center text-gray-400">
               <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
               <p className="text-sm">John_Doe_Resume_2026.pdf</p>
               <p className="text-xs mt-2 text-emerald-400">Successfully Parsed</p>
             </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 rounded-xl border border-white/5 bg-black/40 backdrop-blur-md">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" /> Auto-Optimization
            </h2>
            <p className="text-sm text-gray-400 mb-4">
              When the application agent runs, it automatically creates tailored versions of your resume for each specific job description, highlighting the most relevant skills.
            </p>
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-blue-400 font-medium">Optimization Engine</span>
                <span className="text-xs text-blue-300 px-2 py-1 bg-blue-500/20 rounded">Active</span>
              </div>
              <p className="text-xs text-gray-400">Tailoring keywords, rewriting bullets for impact, and formatting for ATS compatibility.</p>
            </div>
          </div>

          <div className="p-6 rounded-xl border border-white/5 bg-black/40 backdrop-blur-md">
            <h2 className="text-lg font-semibold text-white mb-4">Cover Letter Generator</h2>
            <p className="text-sm text-gray-400 mb-4">
              Generate highly personalized cover letters based on your master resume and a target job description.
            </p>
            <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg font-medium transition-all shadow-lg shadow-blue-500/20">
              Generate New Cover Letter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
