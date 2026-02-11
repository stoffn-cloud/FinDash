'use client';

import { 
  LayoutDashboard, PieChart, ShieldAlert, Grid3X3, 
  History, Landmark, Calendar, Zap, Search, Calculator 
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
    <aside className="hidden md:flex flex-col items-center py-6 gap-6 w-16 border-r border-slate-800/40 bg-slate-950/20">
      {menuItems.map((item) => (
        <TooltipProvider key={item.id}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "h-10 w-10 transition-all duration-300 group relative",
                  activeTab === item.id 
                    ? 'text-blue-400 bg-blue-500/10 border border-blue-500/20' 
                    : 'text-slate-500 hover:text-slate-200'
                )}
              >
                <item.icon className="w-5 h-5" />
                {activeTab === item.id && (
                  <motion.div layoutId="activeSideTab" className="absolute left-0 w-0.5 h-6 bg-blue-500 rounded-r-full" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-slate-950 text-blue-400 text-[10px] uppercase font-bold">
              {item.tooltip}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </aside>
  );
}