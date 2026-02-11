"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Info, Grid3X3 } from "lucide-react";

interface CorrelationMatrixProps {
  title: string;
  subtitle?: string;
  items?: string[]; // De namen van de asset classes of tickers
  correlations?: Record<string, number>; 
}

export default function CorrelationMatrix({
  title,
  subtitle,
  items = [],
  correlations = {},
}: CorrelationMatrixProps) {
  
  if (!items || items.length === 0) {
    return (
      <div className="rounded-3xl bg-black/20 border border-white/5 p-12 text-center backdrop-blur-xl">
        <Grid3X3 className="w-8 h-8 text-slate-700 mx-auto mb-4 opacity-20" />
        <p className="text-slate-500 font-mono text-xs uppercase tracking-widest">
          No data nodes detected for matrix generation
        </p>
      </div>
    );
  }

  const getCorrelation = (item1: string, item2: string) => {
    if (item1 === item2) return 1.0;
    const pair1 = `${item1}-${item2}`;
    const pair2 = `${item2}-${item1}`;
    // Als de engine geen correlatie geeft, gebruiken we een veilige fallback van 0.5 voor gelijke types
    return correlations[pair1] ?? correlations[pair2] ?? 0.0;
  };

  const getStyle = (val: number) => {
    // High Positive Correlation (Gevaar voor diversificatie)
    if (val >= 0.7) return "bg-rose-500/80 text-white font-black shadow-[0_0_15px_rgba(244,63,94,0.3)]";
    // Moderate Positive
    if (val >= 0.3) return "bg-rose-500/20 text-rose-300 border border-rose-500/20";
    // Neutral / Low
    if (val > -0.3) return "bg-slate-800/40 text-slate-500 border border-white/5";
    // Negative Correlation (Goed voor diversificatie)
    return "bg-blue-500/60 text-white font-black shadow-[0_0_15px_rgba(59,130,246,0.3)]";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl bg-black/20 border border-white/5 backdrop-blur-xl overflow-hidden shadow-2xl"
    >
      <div className="p-8 border-b border-white/5 flex justify-between items-start bg-white/[0.02]">
        <div>
          <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">{title}</h3>
          {subtitle && <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-2">{subtitle}</p>}
        </div>
        <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <Grid3X3 className="w-4 h-4 text-blue-500" />
        </div>
      </div>

      <div className="p-8 overflow-x-auto">
        <table className="border-separate border-spacing-2 mx-auto">
          <thead>
            <tr>
              <th className="p-2"></th>
              {items.map((item) => (
                <th key={item} className="p-2 min-w-[64px]">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block -rotate-45 origin-bottom-left translate-y-2">
                    {item}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((rowItem, rowIndex) => (
              <tr key={rowItem}>
                <td className="p-3 text-[10px] font-black text-slate-400 uppercase tracking-widest pr-6 italic">
                  {rowItem}
                </td>
                {items.map((colItem, colIndex) => {
                  const val = getCorrelation(rowItem, colItem);
                  const isDiagonal = rowIndex === colIndex;

                  return (
                    <td key={colItem} className="p-1">
                      <motion.div
                        whileHover={{ scale: 1.1, zIndex: 10 }}
                        className={cn(
                          "w-14 h-14 flex items-center justify-center rounded-xl text-[11px] font-mono transition-all cursor-crosshair",
                          isDiagonal 
                            ? "bg-white/5 text-slate-600 border border-white/10" 
                            : getStyle(val)
                        )}
                        title={`${rowItem} / ${colItem}: ${val.toFixed(2)}`}
                      >
                        {val.toFixed(2)}
                      </motion.div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Terminal Legenda */}
      <div className="px-8 py-6 bg-black/40 border-t border-white/5 flex flex-wrap justify-center gap-10">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">High Coupling</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-slate-700" />
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Independent</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Diversifier</span>
        </div>
        <div className="ml-auto flex items-center gap-2 text-[9px] font-mono text-slate-600 italic">
          <Info className="w-3 h-3" />
          COEFFICIENT RANGE: [-1.00 : +1.00]
        </div>
      </div>
    </motion.div>
  );
}