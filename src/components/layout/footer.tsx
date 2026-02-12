'use client';

import { ShieldCheck, Cpu, Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-white/5 bg-[#010409]/60 backdrop-blur-md py-10">
      <div className="max-w-[1600px] mx-auto px-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          
          {/* Security & Copyright Section */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-slate-900 border border-slate-800 rounded-md flex items-center justify-center shadow-inner">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-500/80" />
              </div>
              <p className="text-[11px] text-slate-500 font-medium tracking-tight">
                © 2026 <span className="text-slate-300">Quantum Alpha Terminal</span>. 
                <span className="hidden sm:inline"> System secured with AES-256 Encryption.</span>
              </p>
            </div>
          </div>

          {/* System Status & Links */}
          <div className="flex items-center gap-8">
            {/* Real-time Status Badge */}
            <div className="flex items-center gap-4 border-r border-white/5 pr-8">
              <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-slate-600" />
                <span className="text-[10px] text-slate-600 font-mono uppercase tracking-widest">Global Nodes: Active</span>
              </div>
              <div className="flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5 text-slate-600" />
                <span className="text-[10px] text-slate-600 font-mono uppercase tracking-widest">Latency: 14ms</span>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex gap-6">
              <a href="#" className="text-[10px] text-slate-500 hover:text-blue-400 font-bold uppercase tracking-widest transition-colors">Documentation</a>
              <a href="#" className="text-[10px] text-slate-500 hover:text-blue-400 font-bold uppercase tracking-widest transition-colors">Legal</a>
              <a href="#" className="text-[10px] text-slate-500 hover:text-blue-400 font-bold uppercase tracking-widest transition-colors">Support</a>
            </nav>
          </div>
        </div>
        
        {/* Bottom Decorative Line */}
        <div className="mt-8 h-0.5 w-full bg-gradient-to-r from-transparent via-blue-500/10 to-transparent" />
      </div>
    </footer>
  );
}