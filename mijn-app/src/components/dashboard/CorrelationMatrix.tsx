import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function CorrelationMatrix({ title, subtitle, items, correlations }) {
  if (!items || items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/50 border border-slate-700/50 backdrop-blur-xl p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <p className="text-slate-400">No data available</p>
      </motion.div>
    );
  }

  // Get correlation value between two items
  const getCorrelation = (item1, item2) => {
    if (item1 === item2) return 1;
    const key1 = `${item1}-${item2}`;
    const key2 = `${item2}-${item1}`;
    return correlations?.[key1] ?? correlations?.[key2] ?? 0;
  };

  // Color scale from red (-1) through white (0) to green (1)
  const getCorrelationColor = (value) => {
    if (value >= 0.7) return "bg-emerald-500/80 text-white";
    if (value >= 0.4) return "bg-emerald-500/40 text-white";
    if (value >= 0.1) return "bg-emerald-500/20 text-slate-200";
    if (value > -0.1) return "bg-slate-700/50 text-slate-300";
    if (value > -0.4) return "bg-rose-500/20 text-slate-200";
    if (value > -0.7) return "bg-rose-500/40 text-white";
    return "bg-rose-500/80 text-white";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/50 border border-slate-700/50 backdrop-blur-xl overflow-hidden"
    >
      <div className="p-6 border-b border-slate-700/50">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        {subtitle && <p className="text-sm text-slate-400 mt-1">{subtitle}</p>}
      </div>

      <div className="p-4 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="p-2 text-left text-xs text-slate-500 font-medium min-w-[100px]"></th>
              {items.map((item) => (
                <th key={item} className="p-2 text-center text-xs text-slate-400 font-medium min-w-[60px]">
                  <div className="truncate max-w-[80px]" title={item}>
                    {item.length > 8 ? item.substring(0, 8) + "…" : item}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((rowItem, rowIndex) => (
              <tr key={rowItem}>
                <td className="p-2 text-xs text-slate-300 font-medium">
                  <div className="truncate max-w-[100px]" title={rowItem}>{rowItem}</div>
                </td>
                {items.map((colItem, colIndex) => {
                  const correlation = getCorrelation(rowItem, colItem);
                  const isDiagonal = rowIndex === colIndex;
                  
                  return (
                    <td key={colItem} className="p-1">
                      <div
                        className={cn(
                          "w-full h-10 flex items-center justify-center rounded text-xs font-medium transition-all",
                          isDiagonal ? "bg-slate-600/50 text-slate-400" : getCorrelationColor(correlation)
                        )}
                        title={`${rowItem} × ${colItem}: ${correlation.toFixed(2)}`}
                      >
                        {correlation.toFixed(2)}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="px-6 py-4 border-t border-slate-700/50">
        <div className="flex items-center justify-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-rose-500/80" />
            <span className="text-slate-400">-1.0</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-slate-700/50" />
            <span className="text-slate-400">0.0</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-emerald-500/80" />
            <span className="text-slate-400">+1.0</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}