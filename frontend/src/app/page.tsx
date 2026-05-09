"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Bot, Sparkles, Network, Briefcase, Zap } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#03050C] text-white overflow-hidden relative selection:bg-blue-500/30">
      {/* Background Gradients & Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] opacity-50" />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tighter">CareerPilot AI</span>
        </div>
        <div className="flex items-center gap-6 text-sm font-medium text-gray-400">
          <Link href="#features" className="hover:text-white transition-colors">Features</Link>
          <Link href="#agents" className="hover:text-white transition-colors">AI Agents</Link>
          <Link href="/login" className="hover:text-white transition-colors">Sign In</Link>
          <Link href="/dashboard" className="px-4 py-2 rounded-full bg-white text-black font-semibold hover:bg-gray-200 transition-all">
            Enter Mission Control
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center pt-32 pb-20 px-4 text-center max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm font-medium mb-8"
        >
          <Sparkles className="w-4 h-4" />
          <span>v2.0 Autonomous AI Engine</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-6xl md:text-8xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60"
        >
          Your Autonomous <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600">
            Career Workforce
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-gray-400 max-w-2xl mb-10"
        >
          Deploy a team of intelligent AI agents to hunt for opportunities, optimize your resume, and auto-apply to top tech jobs while you sleep.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex items-center gap-4"
        >
          <Link href="/dashboard" className="px-8 py-4 rounded-xl bg-blue-600 text-white font-semibold flex items-center gap-2 hover:bg-blue-500 transition-all hover:shadow-[0_0_30px_-5px_rgba(37,99,235,0.5)]">
            Deploy Agents <ArrowRight className="w-5 h-5" />
          </Link>
          <Link href="#demo" className="px-8 py-4 rounded-xl border border-gray-800 bg-white/5 hover:bg-white/10 transition-all font-semibold text-white">
            View Live Demo
          </Link>
        </motion.div>
      </section>

      {/* Feature Visualization */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="rounded-2xl border border-gray-800/60 bg-black/50 backdrop-blur-xl p-8 overflow-hidden relative"
        >
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-xl bg-white/5 border border-white/5 hover:border-blue-500/30 transition-colors">
              <Network className="w-10 h-10 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Agent Swarm</h3>
              <p className="text-sm text-gray-400">Multiple specialized agents communicating seamlessly to execute your job search strategy.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-xl bg-white/5 border border-white/5 hover:border-indigo-500/30 transition-colors">
              <Briefcase className="w-10 h-10 text-indigo-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Auto Apply</h3>
              <p className="text-sm text-gray-400">Our agents navigate complex ATS systems and submit tailored applications on your behalf.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-xl bg-white/5 border border-white/5 hover:border-purple-500/30 transition-colors">
              <Zap className="w-10 h-10 text-purple-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Live Insights</h3>
              <p className="text-sm text-gray-400">Real-time analytics and matching scores to keep you updated on your application pipeline.</p>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
