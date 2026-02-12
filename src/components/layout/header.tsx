'use client';

import { 
  ShieldCheck, 
  RefreshCcw, 
  Bell, 
  ChevronDown, 
  Settings, 
  Calculator, 
  LogOut,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { 
  Avatar, 
  AvatarFallback, 
  AvatarImage 
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface HeaderProps {
  isFetching: boolean;
  onRefresh: () => void;
}

export default function Header({ isFetching, onRefresh }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#020617]/80 backdrop-blur-xl supports-[backdrop-filter]:bg-[#020617]/60">
      <div className="max-w-[1600px] mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logo Sectie: Meer contrast en diepte */}
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-600 rounded-xl blur-md opacity-20 group-hover:opacity-40 transition-opacity" />
              <div className="relative w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg border border-white/10">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tighter text-white uppercase italic">Quantum Alpha</span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">Terminal v2.0</span>
                <span className="w-1 h-1 rounded-full bg-slate-700" />
                <span className="text-[10px] text-blue-400 font-bold uppercase tracking-tight">Live Engine</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Icons & Profile */}
        <div className="flex items-center gap-4">
          
          {/* Market Status Badge */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/5 border border-emerald-500/10 mr-2">
            <Activity className="w-3 h-3 text-emerald-500" />
            <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Market Open</span>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          <TooltipProvider>
            <div className="flex items-center gap-2 border-r border-white/5 pr-4 mr-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                    onClick={onRefresh}
                    disabled={isFetching}
                  >
                    <RefreshCcw className={cn("w-4 h-4", isFetching && "animate-spin text-blue-500")} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-slate-900 border-white/10 text-xs">Sync Data</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl relative">
                    <Bell className="w-4 h-4" />
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-600 rounded-full border-2 border-[#020617]" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-slate-900 border-white/10 text-xs">Notifications</TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>

          {/* User Dropdown: Verfijnde stijlen */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-12 pl-1 pr-3 hover:bg-white/5 rounded-2xl group transition-all">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-9 w-9 border-2 border-slate-800 rounded-xl">
                      <AvatarImage src="/avatar.png" />
                      <AvatarFallback className="bg-slate-800 text-slate-400 text-xs">CD</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-blue-600 border-2 border-[#020617] rounded-full flex items-center justify-center">
                       <div className="w-1 h-1 bg-white rounded-full animate-ping" />
                    </div>
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors leading-none tracking-tight">Christophe</p>
                    <p className="text-[9px] text-slate-500 mt-1 uppercase font-black tracking-widest">Premium</p>
                  </div>
                  <ChevronDown className="w-3 h-3 text-slate-600 group-hover:text-white transition-colors" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60 bg-[#0f172a] border-white/10 text-slate-200 rounded-2xl p-2 shadow-2xl">
              <DropdownMenuLabel className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em] px-3 py-2">System Access</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/5" />
              <DropdownMenuItem className="gap-3 focus:bg-white/5 focus:text-white cursor-pointer rounded-xl py-2.5 px-3">
                <Settings className="w-4 h-4 text-slate-500" /> <span className="text-sm font-medium">Terminal Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-3 focus:bg-white/5 focus:text-white cursor-pointer rounded-xl py-2.5 px-3">
                <Calculator className="w-4 h-4 text-slate-500" /> <span className="text-sm font-medium">Performance Metrics</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/5" />
              <DropdownMenuItem className="gap-3 text-rose-400 focus:bg-rose-500/10 focus:text-rose-400 cursor-pointer rounded-xl py-2.5 px-3">
                <LogOut className="w-4 h-4" /> <span className="text-sm font-bold">Terminate Session</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}