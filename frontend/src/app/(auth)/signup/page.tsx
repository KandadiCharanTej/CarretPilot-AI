"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Bot, ArrowRight, Upload, CheckCircle2 } from "lucide-react";

export default function SignupPage() {
  const [step, setStep] = useState(1);
  const [resumeUploaded, setResumeUploaded] = useState(false);

  return (
    <div className="min-h-screen bg-[#03050C] flex flex-col justify-center items-center relative overflow-hidden selection:bg-blue-500/30 py-12">
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xl p-8 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 relative z-10 shadow-2xl"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(37,99,235,0.5)]">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {step === 1 ? "Create Your Account" : step === 2 ? "Upload Resume" : "Profile Setup"}
          </h2>
          <p className="text-gray-400 text-sm mt-2 text-center max-w-sm">
            {step === 1 ? "Join the autonomous career revolution." : step === 2 ? "Let our AI analyze your past experience." : "Configure your career preferences for the AI."}
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-1.5 w-12 rounded-full ${step >= i ? 'bg-blue-500' : 'bg-white/10'}`} />
          ))}
        </div>

        {step === 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">First Name</label>
                <input type="text" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500/50 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Last Name</label>
                <input type="text" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500/50 outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Email Address</label>
              <input type="email" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500/50 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Password</label>
              <input type="password" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500/50 outline-none" />
            </div>

            <button onClick={() => setStep(2)} className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg mt-6 transition-all flex justify-center items-center gap-2">
              Continue <ArrowRight className="w-4 h-4" />
            </button>

            <div className="mt-6 flex items-center justify-between gap-4">
              <div className="h-px bg-white/10 flex-1" />
              <span className="text-xs text-gray-500 uppercase tracking-wider">Or</span>
              <div className="h-px bg-white/10 flex-1" />
            </div>

            <div className="space-y-3 mt-6">
              <button className="w-full py-2.5 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium rounded-lg transition-colors flex justify-center items-center gap-2">
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Sign up with Google
              </button>
              <button className="w-full py-2.5 px-4 bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 border border-[#0A66C2]/30 text-white font-medium rounded-lg transition-colors flex justify-center items-center gap-2">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#0A66C2]" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                Sign up with LinkedIn
              </button>
            </div>
            <p className="text-center text-sm text-gray-400 mt-4">
              Already have an account? <Link href="/login" className="text-blue-400 hover:text-blue-300">Log in</Link>
            </p>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div 
              className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center transition-colors cursor-pointer ${resumeUploaded ? 'border-emerald-500/50 bg-emerald-500/10' : 'border-white/20 hover:border-blue-500/50 bg-white/5'}`}
              onClick={() => setResumeUploaded(true)}
            >
              {resumeUploaded ? (
                <>
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mb-4" />
                  <h3 className="text-lg font-medium text-white mb-1">Resume Uploaded Successfully</h3>
                  <p className="text-sm text-gray-400">AI is extracting your skills and experience.</p>
                </>
              ) : (
                <>
                  <Upload className="w-12 h-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-white mb-1">Upload your PDF Resume</h3>
                  <p className="text-sm text-gray-400">Drag and drop, or click to browse files</p>
                </>
              )}
            </div>

            <div className="flex gap-4">
              <button onClick={() => setStep(1)} className="px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors">Back</button>
              <button onClick={() => setStep(3)} disabled={!resumeUploaded} className={`flex-1 py-3 px-4 rounded-lg flex justify-center items-center gap-2 transition-all ${resumeUploaded ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-white/5 text-gray-500 cursor-not-allowed'}`}>
                Analyze Profile <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">CGPA</label>
                <input type="text" defaultValue="8.5" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500/50 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Location</label>
                <input type="text" defaultValue="Remote" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500/50 outline-none" />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Skills (Comma separated)</label>
              <input type="text" defaultValue="React, Next.js, Python, TypeScript" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500/50 outline-none" />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Preferred Roles</label>
              <input type="text" defaultValue="Software Engineer Intern, Frontend Developer" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500/50 outline-none" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">LinkedIn Profile</label>
                <input type="text" placeholder="https://linkedin.com/in/..." className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500/50 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">GitHub Profile</label>
                <input type="text" placeholder="https://github.com/..." className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500/50 outline-none" />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button onClick={() => setStep(2)} className="px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors">Back</button>
              <Link href="/dashboard" className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg transition-all flex justify-center items-center gap-2 shadow-lg shadow-blue-500/20">
                Complete Setup & Go to Mission Control <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        )}

      </motion.div>
    </div>
  );
}
