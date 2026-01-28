import { motion } from "framer-motion";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend 
} from "recharts";
import { format, parseISO } from "date-fns";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 shadow-2xl">
        <p className="text-slate-400 text-xs mb-2">
          {format(parseISO(label), "MMM d, yyyy")}
        </p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-slate-300">{entry.name}:</span>
            <span className="text-sm font-semibold text-white">
              {entry.value.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function PerformanceChart({ data, benchmarkName = "S&P 500" }) {
  if (!data || data.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/50 border border-slate-700/50 backdrop-blur-xl p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-6">Performance vs Benchmark</h3>
        <p className="text-slate-400">No performance data available</p>
      </motion.div>
    );
  }

  // Normalize data to show percentage change from start
  const startPortfolio = data[0]?.portfolio_value || 100;
  const startBenchmark = data[0]?.benchmark_value || 100;
  
  const normalizedData = data.map(item => ({
    date: item.date,
    Portfolio: ((item.portfolio_value - startPortfolio) / startPortfolio) * 100,
    [benchmarkName]: ((item.benchmark_value - startBenchmark) / startBenchmark) * 100,
  }));

  const lastPortfolio = normalizedData[normalizedData.length - 1]?.Portfolio || 0;
  const lastBenchmark = normalizedData[normalizedData.length - 1]?.[benchmarkName] || 0;
  const outperformance = lastPortfolio - lastBenchmark;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/50 border border-slate-700/50 backdrop-blur-xl p-6"
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white">Performance vs Benchmark</h3>
          <p className="text-sm text-slate-400 mt-1">Comparing to {benchmarkName}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500 uppercase tracking-wide">Alpha</p>
          <p className={`text-xl font-semibold ${outperformance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {outperformance >= 0 ? '+' : ''}{outperformance.toFixed(2)}%
          </p>
        </div>
      </div>
      
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={normalizedData}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#334155" 
              vertical={false}
            />
            <XAxis 
              dataKey="date" 
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              tickFormatter={(value) => format(parseISO(value), "MMM d")}
            />
            <YAxis 
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value.toFixed(0)}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              formatter={(value) => <span className="text-slate-300 text-sm">{value}</span>}
            />
            <Line 
              type="monotone" 
              dataKey="Portfolio" 
              stroke="#3B82F6" 
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 6, fill: "#3B82F6", stroke: "#1e293b", strokeWidth: 2 }}
            />
            <Line 
              type="monotone" 
              dataKey={benchmarkName}
              stroke="#64748b" 
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              activeDot={{ r: 5, fill: "#64748b", stroke: "#1e293b", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}