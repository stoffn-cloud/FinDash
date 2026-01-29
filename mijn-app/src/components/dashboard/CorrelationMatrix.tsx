import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";

export default function CorrelationMatrix({ title, subtitle, items = [], correlations = {} }) {
  // Fallback voor als er geen data is
  if (!items || items.length === 0) {
    return (
      <div className="rounded-2xl bg-slate-900/50 border border-slate-700/50 p-8 text-center">
        <p className="text-slate-500 italic">Selecteer activa om correlaties te vergelijken</p>
      </div>
    );
  }

  // Verbeterde helper om correlatie op te halen (handelt A-B en B-A matches af)
  const getCorrelation = (item1, item2) => {
    if (item1 === item2) return 1.0;
    const pair1 = `${item1}-${item2}`;
    const pair2 = `${item2}-${item1}`;
    
    // Zoek in de correlations prop, anders een veilige 0.0
    return correlations[pair1] ?? correlations[pair2] ?? 0.0;
  };

  // Dynamische kleurstyling op basis van correlatiewaarde
  const getStyle = (val) => {
    if (val >= 0.7) return "bg-emerald-500/80 text-white font-bold";
    if (val >= 0.3) return "bg-emerald-500/30 text-emerald-200";
    if (val > -0.3) return "bg-slate-800/50 text-slate-400"; // Neutraal
    if (val > -0.7) return "bg-rose-500/30 text-rose-200";
    return "bg-rose-500/80 text-white font-bold";
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-2xl bg-slate-900/50 border border-slate-700/50 backdrop-blur-xl overflow-hidden"
    >
      <div className="p-6 border-b border-slate-700/50 flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold text-white">{title}</h3>
          {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
        </div>
        <Info className="w-4 h-4 text-slate-600" />
      </div>

      <div className="p-4 overflow-x-auto">
        <table className="w-full border-separate border-spacing-1">
          <thead>
            <tr>
              <th className="p-2"></th>
              {items.map((item) => (
                <th key={item} className="p-2 text-center">
                  <span className="text-[10px] uppercase tracking-tighter text-slate-500 font-bold block rotate-[-45deg] origin-bottom-left ml-4">
                    {item}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((rowItem, rowIndex) => (
              <tr key={rowItem}>
                <td className="p-2 text-xs font-semibold text-slate-400 whitespace-nowrap pr-4">
                  {rowItem}
                </td>
                {items.map((colItem, colIndex) => {
                  const val = getCorrelation(rowItem, colItem);
                  const isDiagonal = rowIndex === colIndex;
                  
                  return (
                    <td key={colItem} className="p-0.5">
                      <div
                        className={cn(
                          "w-12 h-12 flex items-center justify-center rounded-md text-[11px] transition-all hover:ring-2 hover:ring-white/20 cursor-default",
                          isDiagonal ? "bg-slate-700/20 text-slate-600" : getStyle(val)
                        )}
                        title={`${rowItem} vs ${colItem}: ${val.toFixed(2)}`}
                      >
                        {val.toFixed(2)}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legenda */}
      <div className="px-6 py-4 bg-slate-900/80 border-t border-slate-700/50 flex justify-center gap-8 text-[10px] font-bold uppercase tracking-widest">
        <div className="flex items-center gap-2 text-rose-400">
          <div className="w-3 h-3 rounded-sm bg-rose-500" /> Negatief
        </div>
        <div className="flex items-center gap-2 text-slate-500">
          <div className="w-3 h-3 rounded-sm bg-slate-700" /> Neutraal
        </div>
        <div className="flex items-center gap-2 text-emerald-400">
          <div className="w-3 h-3 rounded-sm bg-emerald-500" /> Positief
        </div>
      </div>
    </motion.div>
  );
}