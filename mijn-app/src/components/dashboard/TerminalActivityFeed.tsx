import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Code, Cpu, ShieldCheck } from "lucide-react";

interface LogEntry {
  id: number;
  timestamp: string;
  type: "info" | "success" | "warning" | "error";
  message: string;
}

export default function TerminalActivityFeed() {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    const initialLogs: LogEntry[] = [
      { id: 1, timestamp: new Date().toLocaleTimeString(), type: "info", message: "Terminal session initialized. Protocol v2.4" },
      { id: 2, timestamp: new Date().toLocaleTimeString(), type: "success", message: "Portfolio data validation successful." },
      { id: 3, timestamp: new Date().toLocaleTimeString(), type: "info", message: "Real-time market feed connected." },
    ];
    setLogs(initialLogs);

    const interval = setInterval(() => {
      const messages = [
        "Rebalancing check completed.",
        "Fetched latest MSCI World Index data.",
        "Currency exposure updated (USD/EUR).",
        "Risk metrics calculated: Beta within limits.",
        "Asset allocation verified against target.",
        "Encrypted backup generated.",
      ];
      const types: LogEntry["type"][] = ["info", "success", "info"];

      const newLog: LogEntry = {
        id: Date.now(),
        timestamp: new Date().toLocaleTimeString(),
        type: types[Math.floor(Math.random() * types.length)],
        message: messages[Math.floor(Math.random() * messages.length)],
      };

      setLogs((prev) => [newLog, ...prev].slice(0, 5));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-2xl bg-slate-950 border border-slate-800 p-5 font-mono text-[11px] overflow-hidden relative shadow-inner">
      <div className="absolute top-0 right-0 p-2 opacity-10">
        <Code className="w-12 h-12 text-blue-500" />
      </div>

      <div className="flex items-center gap-2 mb-4 text-slate-500 border-b border-slate-800 pb-2">
        <Terminal className="w-3.5 h-3.5" />
        <span className="uppercase tracking-widest font-bold">System Console</span>
        <div className="flex gap-1 ml-auto">
          <div className="w-2 h-2 rounded-full bg-red-500/50" />
          <div className="w-2 h-2 rounded-full bg-amber-500/50" />
          <div className="w-2 h-2 rounded-full bg-emerald-500/50" />
        </div>
      </div>

      <div className="space-y-2 h-[120px] overflow-hidden">
        <AnimatePresence initial={false}>
          {logs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-start gap-3"
            >
              <span className="text-slate-600 shrink-0">[{log.timestamp}]</span>
              <span className={
                log.type === "success" ? "text-emerald-400" :
                log.type === "error" ? "text-rose-400" :
                log.type === "warning" ? "text-amber-400" :
                "text-blue-400"
              }>
                {log.type.toUpperCase()}:
              </span>
              <span className="text-slate-300 italic">{log.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="mt-4 flex items-center gap-4 text-[10px] text-slate-600 border-t border-slate-800 pt-3">
        <div className="flex items-center gap-1">
          <Cpu className="w-3 h-3" />
          <span>CPU: 12%</span>
        </div>
        <div className="flex items-center gap-1">
          <ShieldCheck className="w-3 h-3" />
          <span>AUTH: SECURE</span>
        </div>
        <motion.div
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="ml-auto flex items-center gap-2 text-emerald-500/70"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
          <span>CONNECTED</span>
        </motion.div>
      </div>
    </div>
  );
}
