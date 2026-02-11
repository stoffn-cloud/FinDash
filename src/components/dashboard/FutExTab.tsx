"use client";

import React from 'react';
import { motion } from "framer-motion";
import { Target, TrendingUp, Zap, BarChart3, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface FutExTabProps {
  assets: any[];
  inputs: Record<string, number>;
  onInputChange: (newInputs: Record<string, number>) => void;
}

export default function FutExTab({ assets, inputs, onInputChange }: FutExTabProps) {
  // Extract unieke asset classes uit de live assets
  const assetClasses: string[] = Array.from(new Set(assets.map((a: any) => a.assetClass)));

  const handleInputChange = (className: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    onInputChange({
      ...inputs,
      [className]: numValue
    });
  };

  const inputValues = Object.values(inputs);
  const averageReturn = inputValues.length > 0 
    ? inputValues.reduce((a, b) => a + b, 0) / inputValues.length 
    : 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="space-y-8 pb-12"
    >
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-blue-600/10 border border-blue-600/20 shadow-[0_0_15px_rgba(37,99,235,0.1)]">
            <Target className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Strategic Projections</h2>
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em]">Ex-Ante Alpha Estimations (User Defined)</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Input Matrix */}
        <div className="xl:col-span-2 rounded-3xl bg-black/20 border border-white/5 backdrop-blur-xl overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-white/5 bg-white/[0.02]">
             <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Yield Expectation Matrix</h3>
          </div>
          <Table>
            <TableHeader className="bg-white/[0.01]">
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-500 h-12">Asset Node</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-500 h-12 w-[240px]">Proj. Annual Return (%)</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-500 h-12 text-right">Confidence Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assetClasses.map((className) => (
                <TableRow key={className} className="border-white/5 hover:bg-white/[0.02] transition-colors group">
                  <TableCell className="py-4">
                    <span className="text-sm font-black text-white italic uppercase tracking-tight">{className}</span>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="relative w-32 group">
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="0.0"
                        value={inputs[className] ?? ""}
                        onChange={(e) => handleInputChange(className, e.target.value)}
                        className="bg-slate-950/50 border-white/10 text-white font-mono h-10 focus:ring-1 focus:ring-blue-500 transition-all rounded-xl pl-4 pr-8"
                      />
                      <span className="absolute right-3 top-2.5 text-[10px] font-bold text-slate-600 group-focus-within:text-blue-500">%</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 text-right">
                    {(inputs[className] ?? 0) > 12 ? (
                      <span className="text-[9px] font-black bg-rose-500/10 text-rose-500 border border-rose-500/20 px-3 py-1 rounded-lg uppercase tracking-tighter animate-pulse">
                        Aggressive Node
                      </span>
                    ) : (inputs[className] ?? 0) > 0 ? (
                      <span className="text-[9px] font-black bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-3 py-1 rounded-lg uppercase tracking-tighter">
                        Sustainable
                      </span>
                    ) : (
                      <span className="text-[9px] font-black bg-slate-800 text-slate-500 px-3 py-1 rounded-lg uppercase tracking-tighter">
                        Awaiting Data
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Projections Insight Card */}
        <div className="space-y-6">
          <div className="rounded-3xl bg-blue-600/10 border border-blue-600/20 p-8 backdrop-blur-xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <BarChart3 className="w-20 h-20 text-blue-500" />
             </div>
             
             <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-4">Portfolio Consensus</p>
             <h4 className="text-5xl font-black text-white italic font-mono tracking-tighter mb-2">
                {averageReturn.toFixed(2)}%
             </h4>
             <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest leading-relaxed">
                Aggregated expected mean across all user-defined asset nodes.
             </p>

             <div className="mt-8 space-y-4">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                   <span>Projected Growth</span>
                   <span className="text-white">{averageReturn > 5 ? 'Bullish' : 'Conservative'}</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: `${Math.min(averageReturn * 5, 100)}%` }}
                     className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                   />
                </div>
             </div>
          </div>

          <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5">
             <div className="flex gap-3">
                <AlertCircle className="w-4 h-4 text-slate-600 shrink-0" />
                <p className="text-[9px] text-slate-500 font-mono leading-relaxed uppercase">
                   Warning: These projections are hypothetical and serve as inputs for the ex-ante risk engine. Market variance is not accounted for in these static estimates.
                </p>
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}