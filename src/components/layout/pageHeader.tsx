'use client';

import { RefreshCcw, Plus } from "lucide-react";
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
  
  // Helper om de juiste titel te bepalen op basis van de tab
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
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800/40 pb-6 mb-8">
      <div>
        <h1 className="text-4xl font-extrabold text-white tracking-tight transition-all duration-300">
          {getTitle()}
        </h1>
      </div>

      <div className="flex items-center gap-2 mb-1">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRefresh}
          disabled={isFetching}
          className="bg-slate-950/50 border-slate-800 text-slate-400 h-9 px-3 hover:text-white rounded-lg transition-all"
        >
          <RefreshCcw className={cn("w-3.5 h-3.5 mr-2", isFetching && "animate-spin")} /> 
          Sync
        </Button>
      
        <Button 
          size="sm" 
          onClick={onAddAsset}
          className="bg-blue-600 hover:bg-blue-500 text-white h-9 shadow-md shadow-blue-500/20 px-4 font-bold rounded-lg transition-all hover:scale-105 active:scale-95 text-xs"
        >
          <Plus className="w-4 h-4 mr-1.5" /> Asset Toevoegen
        </Button>
      </div>
    </div>
  );
}