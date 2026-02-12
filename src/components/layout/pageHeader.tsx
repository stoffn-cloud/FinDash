'use client';

import { RefreshCcw, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  activeTab: string;
  isFetching: boolean;
  onRefresh: () => void;
  onAddAsset: () => void;
}

export default function PageHeader({ 
  activeTab, 
  isFetching, 
  onRefresh, 
  onAddAsset 
}: PageHeaderProps) {
  
  const getTitle = () => {
    switch (activeTab) {
      case "Overview": return "Portfolio Dashboard";
      case "Asset Classes": return "Asset Allocation";
      case "Risk": return "Risk Management";
      case "Correlations": return "Correlation Matrix";
      case "Markets": return "Markets Analysis";
      case "Calendar": return "Economic Scheduler";
      case "Strategy": return "Strategy Builder";
      case "Search": return "Asset Search";
      case "Calculator": return "Calculator Module";
      default: return "Portfolio Dashboard";
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-900/80">
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-blue-500 font-mono text-[10px] uppercase tracking-[0.2em] mb-1">
          <Sparkles className="w-3 h-3" />
          <span>Quantum Intelligence Active</span>
        </div>
        <h1 className="text-4xl font-black text-white tracking-tighter sm:text-5xl">
          {getTitle()}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Sync Button met betere contrast-stijlen */}
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRefresh}
          disabled={isFetching}
          className="bg-slate-900/40 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 h-10 px-4 rounded-xl transition-all duration-200"
        >
          <RefreshCcw className={cn("w-4 h-4 mr-2 text-blue-500", isFetching && "animate-spin")} /> 
          <span className="font-semibold tracking-wide uppercase text-[10px]">Sync Engine</span>
        </Button>
      
        {/* Asset Toevoegen Button */}
        <Button 
          size="sm" 
          onClick={onAddAsset}
          className="bg-blue-600 hover:bg-blue-500 text-white h-10 shadow-lg shadow-blue-900/20 px-5 font-bold rounded-xl transition-all hover:translate-y-[-1px] active:translate-y-[0px] text-xs uppercase tracking-wider"
        >
          <Plus className="w-4 h-4 mr-2 stroke-[3px]" /> 
          Asset Toevoegen
        </Button>
      </div>
    </div>
  );
}