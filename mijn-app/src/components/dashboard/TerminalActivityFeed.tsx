"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Code, Cpu, ShieldCheck, Wifi } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogEntry {
  id: number;
  timestamp: string;
  type: "info" | "success" | "warning" | "error";
  message: string;
  node: string;
}

export default function TerminalActivityFeed() {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    const initialLogs: LogEntry[] = [
      { id: 1, timestamp: new Date().toLocaleTimeString(), type: "info", message: "Kernel initialization complete. Uplink established.", node: "SYS-01" },
      { id: 2, timestamp: new Date().toLocaleTimeString(), type: "success", message: "Checksum verified: Portfolio Integrity 100%.", node: "SEC-A" },
    ];
    setLogs(initialLogs);

    const interval = setInterval(() => {
      const events = [
        { msg: "Rebalancing vector calculated.", type: "info", node: "QUANT" },
        { msg: "Market volatility spike detected (VIX).", type: "warning", node: "MKT-8" },
        { msg: "MSCI World Snapshot synchronized.", type: "success", node: "DATA" },
        { msg: "Neural engine optimized risk-weighted returns.", type: "info", node: "AI-X" },
        { msg: "Encrypted ledger handshake successful.", type: "success", node: "BLOCK" },
        { msg: "API Rate-limit buffer at 12%.", type: "warning", node: "SYS-01" },
      ];

      const event = events[Math.floor(Math.random() * events.length)];
      const newLog: LogEntry = {
        id: Date.now(),
        timestamp: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        type: event.type as any,
        message: event.msg,
        node: event.node
      };

      setLogs((prev) => [newLog, ...prev].slice(0, 6));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-3xl bg-black border border-white/5 p-6 font-mono text-[10px] overflow-hidden relative group shadow-2xl">
      {/* Terminal Overlay Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_2px,3px_100%] pointer-events-none z-20" />
      <div className="absolute inset-0 bg-gradient-to-t from-blue-500/5 via-transparent to-transparent opacity-20 pointer-events-none" />

      {/* Header Bar */}
      <div className="flex items-center justify-between mb-5 text-slate-500 border-b border-white/5 pb-3 relative z-30">
        <div className="flex items-center gap-2">
          <Terminal className="w-3 h-3 text-blue-500" />
          <span className="font-black uppercase tracking-[0.2em] italic">Telemetry Stream v4.0</span>
        </div>
        <div className="flex gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
          <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500/50 animate-pulse" />
        </div>
      </div>

      {/* Logs Container */}
      <div className="space-y-2.5 h-[150px] relative z-30 overflow-hidden">
        <AnimatePresence initial={false} mode="popLayout">
          {logs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, y: -10, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex items-center gap-3 group/item"
            >
              <span className="text-slate-700 font-bold shrink-0">{log.timestamp}</span>
              <span className="text-[9px] text-slate-800 font-black px-1.5 py-0.5 bg-white/5 rounded border border-white/5 group-hover/item:border-blue-500/30 transition-colors">
                {log.node}
              </span>
              <span className={cn(
                "font-black uppercase tracking-tighter shrink-0",
                log.type === "success" ? "text-emerald-500" :
                log.type === "warning" ? "text-amber-500" :
                "text-blue-500"
              )}>
                {log.type} //
              </span>
              <span className="text-slate-400 truncate tracking-tight font-medium italic">
                {log.message}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Hardware Status Footer */}
      <div className="mt-6 flex items-center justify-between text-[9px] text-slate-600 border-t border-white/5 pt-4 relative z-30 font-black uppercase tracking-widest italic">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-1.5">
            <Cpu className="w-3 h-3 text-blue-500/50" />
            <span>Load: 0.42%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3 h-3 text-emerald-500/50" />
            <span>Enc: AES-256</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-emerald-500">
          <Wifi className="w-3 h-3 animate-pulse" />
          <span className="shadow-[0_0_10px_rgba(16,185,129,0.2)]">Primary Uplink Active</span>
        </div>
      </div>
    </div>
  );
}