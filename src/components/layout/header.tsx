'use client';

import { 
  ShieldCheck, 
  RefreshCcw, 
  Bell, 
  ChevronDown, 
  Settings, 
  Calculator, 
  LogOut 
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
    <header className="sticky top-0 z-40 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-[1600px] mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Logo Sectie */}
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
        </div>

        {/* Action Icons & Profile */}
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
                    onClick={onRefresh}
                    disabled={isFetching}
                  >
                    <RefreshCcw className={cn("w-4 h-4", isFetching && "animate-spin")} />
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

          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="pl-1 pr-2 h-9 hover:bg-slate-900 group">
                <div className="flex items-center gap-3">
                  <Avatar className="h-7 w-7 border border-slate-700">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-medium text-white group-hover:text-blue-400 transition-colors leading-none">Christophe</p>
                    <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-tighter">Premium Account</p>
                  </div>
                  <ChevronDown className="w-3 h-3 text-slate-500" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-slate-950 border-slate-800 text-slate-200">
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
                <LogOut className="w-4 h-4" /> Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}