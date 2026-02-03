import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { usePortfolio } from "@/api/portfolioStore";
import { 
  Bell,
  Settings,
  LayoutDashboard,
  PieChart as PieChartIcon,
  History,
  BarChart3,
  Calendar,
  Layers,
  Calculator,
  ChevronDown,
  ExternalLink,
  ShieldCheck,
  Zap,
  RefreshCcw,
  ShieldAlert,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import DashboardContent from "@/components/dashboard/DashboardContent";
import AssetClassDetail from "@/components/dashboard/AssetClassDetail";
import RiskTab from "@/components/dashboard/RiskTab";

import { mockPortfolio } from "@/app/api/mockData";
import type { Portfolio, AssetClass } from "@/types/dashboard";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const [selectedAssetClass, setSelectedAssetClass] = useState<AssetClass | null>(null);
  const { portfolio, fetchLivePrices } = usePortfolio();
  const [isFetching, setIsFetching] = useState(false);

  const handleRefetch = async () => {
    setIsFetching(true);
    await fetchLivePrices();
    setIsFetching(false);
  };

  const handleAssetClick = (asset: AssetClass) => {
    setSelectedAssetClass(asset);
  };

  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-blue-500/30">
      {/* Background Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[50%] bg-emerald-500/5 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] left-[20%] w-[50%] h-[30%] bg-blue-600/5 blur-[120px] rounded-full" />
      </div>

      {/* Top Navigation */}
      <header className="sticky top-0 z-40 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-[1600px] mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">Quantum Alpha</span>
              <div className="px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-[10px] text-blue-400 font-mono ml-2 uppercase tracking-widest">
                v2.0 • LIVE
              </div>
            </div>

            <nav className="hidden lg:flex items-center gap-1">
              {[
                { label: "Dashboard", icon: LayoutDashboard, active: true },
                { label: "Markets", icon: BarChart3 },
                { label: "Portfolio", icon: PieChartIcon },
                { label: "Strategy", icon: Zap }
              ].map((item) => (
                <Button
                  key={item.label}
                  variant="ghost"
                  size="sm"
                  className={`gap-2 h-9 px-4 ${item.active ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="text-xs font-medium">{item.label}</span>
                </Button>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-1 mr-4 px-3 py-1.5 rounded-full bg-emerald-500/5 border border-emerald-500/10">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] text-emerald-500 font-medium uppercase tracking-wider">Market Open</span>
            </div>

            <TooltipProvider>
              <div className="flex items-center gap-1 border-r border-slate-800 pr-3 mr-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 text-slate-400"
                      onClick={handleRefetch}
                      disabled={isFetching}
                    >
                      <RefreshCcw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Sync Data</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400">
                      <Bell className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Notifications</TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="pl-1 pr-2 h-9 hover:bg-slate-900 group">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-7 w-7 border border-slate-700">
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div className="hidden sm:block text-left">
                      <p className="text-xs font-medium text-white group-hover:text-blue-400 transition-colors leading-none">John Doe</p>
                      <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-tighter">Premium Account</p>
                    </div>
                    <ChevronDown className="w-3 h-3 text-slate-500" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-slate-950 border-slate-800">
                <DropdownMenuLabel className="text-slate-500 font-normal text-xs uppercase tracking-widest p-3">Account</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-800" />
                <DropdownMenuItem className="gap-2 focus:bg-slate-900 focus:text-white cursor-pointer py-2">
                  <Settings className="w-4 h-4" /> Settings
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2 focus:bg-slate-900 focus:text-white cursor-pointer py-2">
                  <Calculator className="w-4 h-4" /> Performance Report
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-slate-800" />
                <DropdownMenuItem className="gap-2 text-rose-400 focus:bg-rose-500/10 focus:text-rose-400 cursor-pointer py-2">
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex max-w-[1600px] mx-auto">
        {/* Secondary Sidebar (Navigation Icons) */}
        <aside className="hidden md:flex flex-col items-center py-6 gap-6 w-16 border-r border-slate-800/40">
  {[
    { id: "Overview", icon: LayoutDashboard, tooltip: "Overview" },
    { id: "Asset Classes", icon: PieChartIcon, tooltip: "Asset Classes" },
    { id: "Risk", icon: ShieldAlert, tooltip: "Risk Analytics" },
    { id: "History", icon: History, tooltip: "Transaction History" },
    { id: "Markets", icon: BarChart3, tooltip: "Markets Analysis" },
    { id: "Calendar", icon: Calendar, tooltip: "Economic Calendar" },
    { id: "Strategy", icon: Zap, tooltip: "Strategy Builder" },
    { id: "Calculator", icon: Calculator, tooltip: "Monte Carlo Sim" }
  ].map((item, i) => (
    <TooltipProvider key={i}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            // Verandert de actieve tab en stuurt de 'main' aan
            onClick={() => setActiveTab(item.id)}
            className={`h-10 w-10 transition-all duration-300 group relative ${
              activeTab === item.id 
                ? 'text-blue-400 bg-blue-500/10 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.2)]' 
                : 'text-slate-500 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <item.icon className={cn(
              "w-5 h-5 transition-transform duration-300 group-hover:scale-110",
              activeTab === item.id && "scale-110"
            )} />
            
            {/* Actieve Indicator (het blauwe streepje links) */}
            {activeTab === item.id && (
              <motion.div 
                layoutId="activeSideTab"
                className="absolute left-0 w-0.5 h-6 bg-blue-500 rounded-r-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right" className="bg-slate-950 border-slate-800 text-[10px] font-bold uppercase tracking-widest text-blue-400">
          {item.tooltip}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ))}
</aside>

        {/* Main Content Area */}
<main className="flex-1 p-4 lg:p-8 min-w-0">
  <div className="max-w-6xl mx-auto space-y-8">
    
{/* --- GECENTRALISEERDE HEADER --- */}
<div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800/40 pb-6 mb-8">
  <div>
    <h1 className="text-4xl font-extrabold text-white tracking-tight">
      {activeTab === "Overview" && "Portfolio Dashboard"}
      {activeTab === "Asset Classes" && "Asset Allocation"}
      {activeTab === "Risk" && "Risk Management"}
      {activeTab === "Markets" && "Markets Analysis"}
      {activeTab === "Calendar" && "Economic Scheduler"}
      {activeTab === "Strategy" && "Portfolio Editor"}
      {activeTab === "History" && "Transaction History"}
      {activeTab === "Calculator" && "Risk Analysis"}
    </h1>
  </div>

  <div className="flex items-center gap-2 mb-1"> {/* mb-1 lijnt ze mooi uit met de onderkant van de tekst */}
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleRefetch}
      disabled={isFetching}
      className="bg-slate-950/50 border-slate-800 text-slate-400 h-9 px-3 hover:text-white rounded-lg transition-all"
    >
      <RefreshCcw className={cn("w-3.5 h-3.5 mr-2", isFetching && "animate-spin")} /> 
      Sync
    </Button>
    
    <Button 
      size="sm" 
      className="bg-blue-600 hover:bg-blue-500 text-white h-9 shadow-md shadow-blue-500/20 px-4 font-bold rounded-lg transition-all hover:scale-105 active:scale-95 text-xs"
      onClick={() => handleAssetClick({ id: 'new', name: 'New Asset' } as any)} 
    >
      <Plus className="w-4 h-4 mr-1.5" /> Asset Toevoegen
    </Button>
  </div>
</div>

    {/* --- CONTENT ZONDER TITELS --- */}
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      {activeTab === "Overview" && (
        <DashboardContent portfolio={portfolio} onAssetClick={handleAssetClick} showOnly="overview" />
      )}
      
      {activeTab === "Asset Classes" && (
        <DashboardContent portfolio={portfolio} onAssetClick={handleAssetClick} showOnly="assets" />
      )}

      {activeTab === "Risk" && (
        <DashboardContent portfolio={portfolio} onAssetClick={handleAssetClick} showOnly="risk" />
      )}

      {activeTab === "Markets" && (
        <DashboardContent portfolio={portfolio} onAssetClick={handleAssetClick} showOnly="markets" />
      )}

      {activeTab === "Calendar" && (
        <DashboardContent portfolio={portfolio} onAssetClick={handleAssetClick} showOnly="calendar" />
      )}

      {activeTab === "Strategy" && (
        <DashboardContent portfolio={portfolio} onAssetClick={handleAssetClick} showOnly="editor" />
      )}

      {/* Fallback voor nog niet geïmplementeerde tabs */}
      {["History", "Calculator"].includes(activeTab) && (
        <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-[2rem]">
          <span className="text-slate-600 font-mono text-xs uppercase tracking-widest">Module Under Construction</span>
        </div>
      )}
    </div>

  </div>
</main>
      </div>

      <AssetClassDetail 
        assetClass={selectedAssetClass} 
        onClose={() => setSelectedAssetClass(null)} 
      />

      <footer className="mt-20 border-t border-slate-900 bg-black/40 py-8">
        <div className="max-w-[1600px] mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-slate-800 rounded flex items-center justify-center">
              <ShieldCheck className="w-3 h-3 text-slate-400" />
            </div>
            <span className="text-xs text-slate-500">© 2024 Quantum Alpha Portfolio. Secured by End-to-End Encryption.</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">Documentation</a>
            <a href="#" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">API Status</a>
            <a href="#" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
