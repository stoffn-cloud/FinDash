'use client';

import { 
  LayoutDashboard, PieChart, ShieldAlert, Grid3X3, 
  History, Landmark, Calendar, Zap, Calculator 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const menuItems = [
  { id: "Overview", icon: LayoutDashboard, tooltip: "Overview" },
  { id: "Asset Classes", icon: PieChart, tooltip: "Asset Classes" },
  { id: "Risk", icon: ShieldAlert, tooltip: "Risk Analytics" },
  { id: "Correlations", icon: Grid3X3, tooltip: "Correlation Matrix" },
  { id: "History", icon: History, tooltip: "Transaction History" },
  { id: "Markets", icon: Landmark, tooltip: "Markets Analysis" },
  { id: "Calendar", icon: Calendar, tooltip: "Economic Calendar" },
  { id: "Strategy", icon: Zap, tooltip: "Strategy Builder" },
  { id: "Calculator", icon: Calculator, tooltip: "Monte Carlo Sim" }
];

export default function Sidebar({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (id: string) => void }) {
  return (
    <aside className="hidden md:flex flex-col items-center py-6 gap-4 w-20 border-r border-slate-900/60 bg-[#020617] sticky top-0 h-screen z-40">
      
      {/* PROFILE SECTION - Beperkt tot de breedte van de sidebar */}
      <div className="mb-6 group relative cursor-pointer">
        <div className="absolute inset-0 bg-blue-500/20 rounded-xl blur-lg group-hover:bg-blue-500/40 transition-all duration-500" />
        <div className="relative w-12 h-12 rounded-xl border border-slate-800 overflow-hidden bg-slate-950 ring-1 ring-white/5">
          <img 
            src="/avatar.png" // Zorg dat de afbeelding in public/avatar.png staat
            alt="Christophe" 
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" 
          />
        </div>
        {/* Status indicator */}
        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-[#020617] rounded-full shadow-lg" />
      </div>

      <div className="h-px w-8 bg-slate-800/50 mb-4" />

      {/* MENU ITEMS */}
      <nav className="flex flex-col gap-4">
        {menuItems.map((item) => (
          <TooltipProvider key={item.id} delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    "h-12 w-12 transition-all duration-300 group relative rounded-xl",
                    activeTab === item.id 
                      ? 'text-blue-400 bg-blue-500/10 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]' 
                      : 'text-slate-500 hover:text-slate-200 hover:bg-slate-800/40'
                  )}
                >
                  <item.icon className={cn(
                    "w-5 h-5 transition-transform duration-300",
                    activeTab === item.id ? "scale-110" : "group-hover:scale-110"
                  )} />
                  
                  {activeTab === item.id && (
                    <motion.div 
                      layoutId="activeSideTab" 
                      className="absolute -right-[21px] w-1 h-8 bg-blue-500 rounded-l-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
                    />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-slate-950 border-slate-800 text-blue-400 text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 shadow-2xl">
                {item.tooltip}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </nav>

      {/* BOTTOM ACTION (Optioneel: Logout of Settings) */}
      <div className="mt-auto pt-6 border-t border-slate-800/50 w-8 flex justify-center">
         <div className="w-1.5 h-1.5 rounded-full bg-slate-700 animate-pulse" />
      </div>
    </aside>
  );
}