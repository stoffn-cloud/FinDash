"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { LucideIcon, Loader2 } from "lucide-react"; // Loader toegevoegd

interface PortfolioValueTileProps {
  label: string;
  value: string | number;
  change: string;
  icon: LucideIcon;
  color: string;
  isLoading?: boolean; // Nieuwe prop om laadstatus te tonen
}

export const PortfolioValueTile = ({ 
  label, 
  value, 
  change, 
  icon: Icon, 
  color,
  isLoading = false 
}: PortfolioValueTileProps) => {
  return (
    <Card className="bg-slate-900/40 border-white/5 backdrop-blur-xl group hover:border-blue-500/50 transition-all duration-500">
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className={cn("p-2 rounded-lg bg-slate-950/50 border border-slate-800", color)}>
            <Icon className="w-4 h-4" />
          </div>
          <Badge className="font-mono text-[10px] bg-blue-500/10 text-blue-400 border-none">
            {isLoading ? "..." : change}
          </Badge>
        </div>
        
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
          {label}
        </p>

        <div className="flex items-center gap-2 mt-1">
          {isLoading ? (
            <Loader2 className="w-5 h-5 text-slate-700 animate-spin" />
          ) : (
            <h3 className="text-2xl font-mono font-bold text-white tracking-tight">
              {value || "---"} 
            </h3>
          )}
        </div>
      </CardContent>
    </Card>
  );
};