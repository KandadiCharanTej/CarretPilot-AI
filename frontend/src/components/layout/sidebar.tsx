"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Target, 
  Network, 
  KanbanSquare, 
  FileEdit, 
  LineChart, 
  Settings,
  Bot
} from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Opportunities", href: "/dashboard/opportunities", icon: Target },
  { name: "AI Agents", href: "/dashboard/agents", icon: Network },
  { name: "Applications", href: "/dashboard/applications", icon: KanbanSquare },
  { name: "Resume Studio", href: "/dashboard/resume", icon: FileEdit },
  { name: "Analytics", href: "/dashboard/analytics", icon: LineChart },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen bg-[#03050C] border-r border-white/5 flex flex-col relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-0 w-full h-32 bg-blue-600/10 blur-[50px] pointer-events-none" />
      
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.5)]">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <span className="text-lg font-bold tracking-tight text-white">CareerPilot</span>
      </div>

      <div className="px-4 py-2 mb-4">
        <div className="px-3 py-1.5 rounded-md bg-white/5 border border-white/5 flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-medium text-gray-300">System Online</span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? "text-white" : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-blue-500/10 border border-blue-500/20 rounded-lg"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <item.icon className={`w-4 h-4 relative z-10 ${isActive ? "text-blue-400" : ""}`} />
              <span className="relative z-10">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5">
        <div className="p-4 rounded-xl bg-gradient-to-b from-blue-900/20 to-transparent border border-blue-500/20">
          <h4 className="text-sm font-medium text-white mb-1">Pro Plan Active</h4>
          <p className="text-xs text-gray-400 mb-3">12/50 Auto-applies used</p>
          <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 w-[24%]" />
          </div>
        </div>
      </div>
    </aside>
  );
}
