import { Search, Bell, Command, Zap } from "lucide-react";

export default function Navbar() {
  return (
    <header className="h-16 border-b border-white/5 bg-[#03050C]/80 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <h1 className="text-white font-medium">Mission Control</h1>
      </div>

      <div className="flex items-center gap-6">
        {/* Command Palette Trigger */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer group">
          <Search className="w-4 h-4" />
          <span className="text-sm">Search</span>
          <div className="flex items-center gap-1 ml-4">
            <Command className="w-3 h-3" />
            <span className="text-xs">K</span>
          </div>
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-4 text-gray-400">
          <button className="hover:text-white transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full border border-[#03050C]" />
          </button>
          
          <div className="w-px h-5 bg-white/10" />

          {/* Profile */}
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white text-xs font-bold ring-2 ring-white/10">
              CT
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
