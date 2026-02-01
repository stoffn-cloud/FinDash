"use client";

import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Wallet, 
  RefreshCw,
  LayoutDashboard,
  History,
  Grid3X3,
  Globe,
  Calendar as CalendarIcon,
  Calculator,
  Search
} from "lucide-react";

// Utilities
import { cn } from "@/lib/utils";

// 1. Definieer het type voor een enkele Asset Class
export interface AssetClass {
  name: string;
  allocation_percent: number;
  current_value: number;
  expected_return: number;
  ytd_return: number;
  color: string;
}

// 2. Definieer de Props voor het component
interface AssetAllocationTableProps {
  assetClasses?: AssetClass[];
  onSelectAsset?: (asset: AssetClass) => void;
}

export default function AssetAllocationTable({ 
  assetClasses = [], 
  onSelectAsset 
}: AssetAllocationTableProps) {
  
  // Veiligheidscheck
  if (!assetClasses || assetClasses.length === 0) {
    return (
      <div className="min-h-screen bg-[#020617] p-10">
        <Skeleton className="h-[400px] w-full bg-slate-800/20 rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200">
      <div className="relative z-10 p-4 md:p-10">
        <div className="max-w-7xl mx-auto space-y-8">
          
          <header className="flex justify-between items-end">
            <h1 className="text-5xl font-extrabold text-white italic">
              {portfolio?.name}
            </h1>
          </header>

          <Tabs defaultValue="dashboard" className="space-y-8">
            <TabsList className="bg-slate-950/60 border border-slate-800">
              <TabsTrigger value="dashboard">Overview</TabsTrigger>
              <TabsTrigger value="assets">Analysis</TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              <TabsContent value="dashboard">
                {/* HIER ZAT DE FOUT: Dubbele nesting en vage checks */}
                {portfolio ? (
                  <TabsContent value="dashboard">
                    {portfolio && (
                      <DashboardContent 
                        portfolio={portfolio} 
                        assetClasses={portfolio.assetClasses} 
                        onSelectAsset={setSelectedAssetClass} 
                      />
                    )}
                  </TabsContent>
                ) : null}
              </TabsContent>
            </AnimatePresence>
          </Tabs>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-slate-700/50 hover:bg-transparent">
            <TableHead className="text-slate-400">Categorie</TableHead>
            <TableHead className="text-slate-400 text-right">Allocatie</TableHead>
            <TableHead className="text-slate-400 text-right">Waarde</TableHead>
            <TableHead className="text-slate-400 text-right">Verwacht Rendement</TableHead>
            <TableHead className="text-slate-400 text-right">YTD</TableHead>
            <TableHead className="w-10"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assetClasses.map((ac, index) => (
            <TableRow
              key={index}
              onClick={() => onSelectAsset && onSelectAsset(ac)}
              className="border-slate-700/50 cursor-pointer hover:bg-slate-800/50 group"
            >
              <TableCell className="font-medium text-white">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ac.color }} />
                  {ac.name}
                </div>
              </TableCell>
              <TableCell className="text-right text-slate-300">
                {ac.allocation_percent?.toFixed(1)}%
              </TableCell>
              <TableCell className="text-right text-white font-medium">
                {formatCurrency(ac.current_value)}
              </TableCell>
              <TableCell className={cn(
                "text-right font-medium",
                ac.expected_return >= 0 ? "text-emerald-400" : "text-rose-400"
              )}>
                {ac.expected_return > 0 ? '+' : ''}{ac.expected_return?.toFixed(1)}%
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  {ac.ytd_return >= 0 ? (
                    <TrendingUp className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-rose-400" />
                  )}
                  <span className={ac.ytd_return >= 0 ? "text-emerald-400" : "text-rose-400"}>
                    {ac.ytd_return?.toFixed(1)}%
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="p-4 border-t border-slate-700/50 bg-slate-800/30 flex justify-between text-xs sm:text-sm">
        <span className="text-slate-400">Totaal Portfolio</span>
        <div className="flex gap-6">
          <span className="text-white font-bold">{formatCurrency(totalValue)}</span>
          <span className="text-slate-400">
            Wtd. Return: <span className="text-emerald-400">
              {(assetClasses.reduce((sum, ac) => sum + ((ac.expected_return || 0) * (ac.allocation_percent || 0) / 100), 0)).toFixed(1)}%
            </span>
          </span>
        </div>
      </div>
    </motion.div>
  );
}
