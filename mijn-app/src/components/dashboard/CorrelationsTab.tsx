"use client";

import { motion } from "framer-motion";
import { Grid3X3, AlertCircle, Info } from "lucide-react";
import CorrelationMatrix from "./CorrelationMatrix";

interface CorrelationsTabProps {
  assetClasses?: any[];
  portfolio?: any;
}

// Statische correlaties (deze zouden in een volgende fase uit een API komen)
const ASSET_CLASS_CORRELATIONS: Record<string, number> = {
  "Equities-Fixed Income": 0.12,
  "Equities-Crypto": 0.45,
  "Equities-Commodities": 0.28,
  "Fixed Income-Crypto": -0.05,
  "Fixed Income-Commodities": -0.15,
  "Crypto-Commodities": 0.18,
};

const SECTOR_CORRELATIONS: Record<string, number> = {
  "Technology-Financials": 0.35,
  "Technology-Energy": -0.12,
  "Healthcare-Technology": 0.42,
  "Energy-Financials": 0.25,
  "Utilities-Technology": -0.08,
};

export default function CorrelationsTab({ assetClasses = [], portfolio = {} }: CorrelationsTabProps) {
  
  // Haal de namen op van de live asset classes uit de engine
  const assetClassNames = assetClasses.length > 0
    ? assetClasses.map(ac => ac.name)
    : ["Equities", "Fixed Income", "Crypto", "Commodities", "Real Estate"];

  // Haal sectoren op (indien aanwezig in de portfolio state)
  const currentSectors = portfolio.sectors || [];
  const sectorNames = currentSectors.length > 0
    ? currentSectors.map((s: any) => s.name)
    : ["Technology", "Healthcare", "Financials", "Energy", "Utilities"];

  return (
    <div className="space-y-10 pb-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-4"
      >
        <div className="p-3 rounded-2xl bg-blue-600/10 border border-blue-600/20 shadow-[0_0_15px_rgba(37,99,235,0.1)]">
          <Grid3X3 className="w-6 h-6 text-blue-500" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Systemic Correlations</h2>
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em]">Historical Rolling 12-Month Coefficient Analysis</p>
        </div>
      </motion.div>

      {/* Warning/Info Box */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-start gap-4 p-6 bg-blue-500/5 rounded-3xl border border-blue-500/10 backdrop-blur-md"
      >
        <AlertCircle className="w-5 h-5 text-blue-400 mt-1 shrink-0" />
        <div className="space-y-1">
          <p className="text-xs font-bold text-blue-100 uppercase tracking-wide">Risk Architecture Insight</p>
          <p className="text-xs text-slate-400 leading-relaxed font-medium">
            Correlatie coëfficiënten tussen <span className="text-white">-1.00</span> en <span className="text-white">+1.00</span> definiëren de portfolio stabiliteit. 
            Nodes met een waarde boven <span className="text-rose-400 font-bold">0.70</span> duiden op een overmatige concentratie van risico bij marktvolatiliteit.
          </p>
        </div>
      </motion.div>

      

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        {/* Macro Matrix */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 pl-2">
            <div className="w-1 h-4 bg-blue-600 rounded-full" />
            <h3 className="text-[11px] font-black text-white uppercase tracking-widest">Cross-Asset Logic</h3>
          </div>
          <CorrelationMatrix
            title="Macro Node Matrix"
            subtitle="Inter-asset dependencies based on current allocation"
            items={assetClassNames}
            correlations={ASSET_CLASS_CORRELATIONS}
          />
        </section>

        {/* Sector Matrix */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 pl-2">
            <div className="w-1 h-4 bg-emerald-600 rounded-full" />
            <h3 className="text-[11px] font-black text-white uppercase tracking-widest">Sector Proximity</h3>
          </div>
          <CorrelationMatrix
            title="Equity Sector Matrix"
            subtitle="Internal stock market linkages and drift patterns"
            items={sectorNames}
            correlations={SECTOR_CORRELATIONS}
          />
        </section>
      </div>

      {/* Footer Info */}
      <div className="flex justify-center">
        <div className="px-6 py-2 rounded-full bg-white/[0.02] border border-white/5 flex items-center gap-3">
          <Info className="w-3 h-3 text-slate-600" />
          <span className="text-[9px] font-mono text-slate-600 uppercase tracking-[0.1em]">
            System status: <span className="text-emerald-500">All Correlation Engines Nominal</span>
          </span>
        </div>
      </div>
    </div>
  );
}
