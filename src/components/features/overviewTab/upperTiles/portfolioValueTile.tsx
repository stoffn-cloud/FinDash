"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { LucideIcon, Loader2 } from "lucide-react";

interface PortfolioValueTileProps {
  label: string;
  value: string | number;
  change: string;
  icon: LucideIcon;
  color: string;
  isLoading?: boolean;
}

export const PortfolioValueTile = ({ 
  label, 
  value, 
  change, 
  icon: Icon, 
  color,
  isLoading = false 
}: PortfolioValueTileProps) => {
  
  // Compatibiliteit check: Als de waarde 0 is of leeg, tonen we een placeholder 
  // Dit voorkomt dat het dashboard er "kapot" uitziet tijdens berekeningen.
  const displayValue = value === 0 || value === "$0" || value === "0" ? "---" : value;

  return (
    <Card className="bg-slate-900/40 border-white/5 backdrop-blur-xl group hover:border-blue-500/50 transition-all duration-500 overflow-hidden relative">
      {/* Subtiele glow effect op hover die past bij de nieuwe engine style */}
      <div className={cn(
        "absolute -right-4 -top-4 w-16 h-16 blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-full",
        color.replace('text-', 'bg-')
      )} />

      <CardContent className="p-5 relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className={cn("p-2 rounded-lg bg-slate-950/50 border border-slate-800 transition-colors duration-500", color)}>
            <Icon className="w-4 h-4" />
          </div>
          <Badge className="font-mono text-[10px] bg-blue-500/10 text-blue-400 border-none px-2 py-0">
            {isLoading ? (
              <Loader2 className="w-2 h-2 animate-spin" />
            ) : (
              change
            )}
          </Badge>
        </div>
        
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          {label}
        </p>

        <div className="flex items-center gap-2 mt-1">
          {isLoading ? (
            <div className="h-8 flex items-center">
              <div className="w-24 h-5 bg-white/5 animate-pulse rounded" />
            </div>
          ) : (
            <h3 className="text-2xl font-mono font-bold text-white tracking-tight">
              {displayValue} 
            </h3>
          )}
        </div>
      </CardContent>
    </Card>
  );
};