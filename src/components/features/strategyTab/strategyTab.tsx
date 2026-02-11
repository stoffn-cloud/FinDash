"use client";

import React, { useState } from "react";
import { Calculator, Zap, TrendingUp, ShieldCheck, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface StrategyTabProps {
  portfolio: any;
}

export default function StrategyTab({ portfolio }: StrategyTabProps) {
  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleRunOptimization = () => {
    setIsOptimizing(true);
    // Hier komt later de wiskundige logica (Monte Carlo / Matrix)
    setTimeout(() => setIsOptimizing(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Kolom 1: Optimizer Parameters */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl backdrop-blur-sm">
            <h3 className="text-white font-bold uppercase text-xs tracking-widest mb-6 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-blue-500" /> Optimization Engine
            </h3>
            
            <div className="space-y-5">
              <div>
                <label className="text-[10px] text-slate-500 uppercase font-black block mb-2">Risk-Free Rate (%)</label>
                <input 
                  type="number" 
                  defaultValue="4.0" 
                  className="w-full bg-black/40 border border-slate-800 rounded-lg h-10 px-4 text-white font-mono text-sm focus:border-blue-500 outline-none transition-colors" 
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-500 uppercase font-black block mb-2">Optimization Target</label>
                <select className="w-full bg-black/40 border border-slate-800 rounded-lg h-10 px-4 text-white font-mono text-xs outline-none cursor-pointer">
                  <option>MAXIMIZE SHARPE RATIO</option>
                  <option>MINIMIZE VOLATILITY</option>
                  <option>MAXIMIZE RETURN @ 10% VOL</option>
                </select>
              </div>

              <div className="pt-4">
                <Button 
                  onClick={handleRunOptimization}
                  disabled={isOptimizing}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold h-12 rounded-xl shadow-lg shadow-blue-500/20 gap-2"
                >
                  {isOptimizing ? (
                    <Zap className="w-4 h-4 animate-spin" />
                  ) : (
                    <Play className="w-4 h-4 fill-current" />
                  )}
                  {isOptimizing ? "CALCULATING..." : "RUN OPTIMIZER"}
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Stats Panel */}
          <div className="bg-blue-500/5 border border-blue-500/10 p-5 rounded-2xl">
            <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-2">Active Universe</p>
            <p className="text-xl font-bold text-white">{portfolio?.assetClasses?.length || 0} Asset Classes</p>
          </div>
        </div>

        {/* Kolom 2 & 3: De Efficient Frontier Visualisatie */}
        <div className="lg:col-span-2">
          <div className="bg-slate-900/20 border border-dashed border-slate-800 h-full min-h-[450px] rounded-[2rem] flex flex-col items-center justify-center p-12 text-center relative overflow-hidden">
            {/* Achtergrond gloed */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />
            
            <div className="relative z-10">
              <div className="w-20 h-20 bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center mb-6 mx-auto shadow-2xl">
                <TrendingUp className={cn("w-10 h-10 text-slate-700", isOptimizing && "text-blue-500 animate-pulse")} />
              </div>
              <h3 className="text-white font-bold text-xl mb-2 tracking-tight">Efficient Frontier Mapping</h3>
              <p className="text-slate-500 text-sm max-w-sm mx-auto leading-relaxed">
                Run the engine to generate the <span className="text-blue-400 font-mono italic">Capital Market Line</span> and identify the optimal tangency portfolio.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}