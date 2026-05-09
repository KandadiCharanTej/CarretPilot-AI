"use client";

import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <Settings className="w-6 h-6 text-blue-400" />
          Settings
        </h1>
        <p className="text-gray-400 text-sm">Configure your AI agents and profile preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl border border-white/5 bg-black/40 backdrop-blur-md space-y-6">
          <h2 className="text-lg font-semibold text-white border-b border-white/5 pb-2">Profile Data</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
              <input type="text" defaultValue="Commander" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500/50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
              <input type="email" defaultValue="commander@careerpilot.ai" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500/50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">LinkedIn URL</label>
              <input type="text" placeholder="https://linkedin.com/in/..." className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500/50" />
            </div>
          </div>
          
          <button className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors font-medium">Save Changes</button>
        </div>

        <div className="p-6 rounded-xl border border-white/5 bg-black/40 backdrop-blur-md space-y-6">
          <h2 className="text-lg font-semibold text-white border-b border-white/5 pb-2">Agent Preferences</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-white">Auto-Apply</h3>
                <p className="text-xs text-gray-400">Allow agents to submit applications without review</p>
              </div>
              <div className="w-10 h-6 bg-blue-600 rounded-full flex items-center px-1 cursor-pointer">
                <div className="w-4 h-4 bg-white rounded-full transform translate-x-4 transition-transform" />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-white">Email Notifications</h3>
                <p className="text-xs text-gray-400">Get notified when an application succeeds</p>
              </div>
              <div className="w-10 h-6 bg-blue-600 rounded-full flex items-center px-1 cursor-pointer">
                <div className="w-4 h-4 bg-white rounded-full transform translate-x-4 transition-transform" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Max Applications Per Day</label>
              <input type="number" defaultValue="50" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500/50" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
