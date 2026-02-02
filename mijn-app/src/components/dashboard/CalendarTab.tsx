"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Info, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isToday,
} from "date-fns";
import { nl } from "date-fns/locale";

interface CalendarTabProps {
  assetClasses?: any[]; // Uit de nieuwe engine
}

type CentralBankEvent = { date: string; name: string; flag: string; type: "central_bank" };
type EarningsEvent = { date: string; name: string; ticker: string; type: "earnings" };
type CalendarEvent = CentralBankEvent | EarningsEvent;

const isCentralBankEvent = (event: CalendarEvent): event is CentralBankEvent => event.type === "central_bank";

// Statische database (in een echte app zou dit een API call zijn)
const CENTRAL_BANK_EVENTS: CentralBankEvent[] = [
  { date: "2026-01-29", name: "Fed", flag: "🇺🇸", type: "central_bank" },
  { date: "2026-02-06", name: "BoE", flag: "🇬🇧", type: "central_bank" },
  { date: "2026-02-18", name: "RBA", flag: "🇦🇺", type: "central_bank" },
  { date: "2026-03-06", name: "ECB", flag: "🇪🇺", type: "central_bank" },
];

const GLOBAL_EARNINGS_DATABASE: EarningsEvent[] = [
  { date: "2026-01-28", name: "Apple", ticker: "AAPL", type: "earnings" },
  { date: "2026-02-11", name: "NVIDIA", ticker: "NVDA", type: "earnings" },
  { date: "2026-02-15", name: "Bitcoin Halving", ticker: "BTC-USD", type: "earnings" }, // Voorbeeld
];

export default function CalendarTab({ assetClasses = [] }: CalendarTabProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // --- Haal tickers op uit de NIEUWE engine structuur (ac.assets) ---
  const myTickers = useMemo(() => {
    const tickers = new Set<string>();
    assetClasses.forEach((ac) => {
      ac.assets?.forEach((asset: any) => {
        if (asset.symbol) tickers.add(asset.symbol.toUpperCase());
      });
    });
    return tickers;
  }, [assetClasses]);

  const allEvents = useMemo<CalendarEvent[]>(() => {
    const relevantEarnings = GLOBAL_EARNINGS_DATABASE.filter((event) =>
      myTickers.has(event.ticker.toUpperCase())
    );
    return [...CENTRAL_BANK_EVENTS, ...relevantEarnings];
  }, [myTickers]);

  const getEventsForDate = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return allEvents.filter((event) => event.date === dateStr);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="rounded-3xl bg-black/20 border border-white/5 p-8 backdrop-blur-xl shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20">
              <CalendarIcon className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">
                {format(currentMonth, "MMMM yyyy", { locale: nl })}
              </h2>
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                {myTickers.size > 0 ? `Monitoring ${myTickers.size} active tickers` : "Global Macro Calendar"}
              </p>
            </div>
          </div>
          <div className="flex gap-2 bg-slate-900/50 p-1.5 rounded-xl border border-white/5">
            <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="text-slate-400 hover:text-white">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="text-slate-400 hover:text-white">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 mb-2">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
            <div key={day} className="text-center text-[10px] font-black uppercase text-slate-600 py-3 tracking-widest">
              {day}
            </div>
          ))}
        </div>

        <div className="rounded-2xl overflow-hidden border border-white/5 bg-slate-950/20">
          {(() => {
            const monthStart = startOfMonth(currentMonth);
            const monthEnd = endOfMonth(monthStart);
            const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
            const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
            const rows = [];
            let day = startDate;

            while (day <= endDate) {
              const daysInRow = [];
              for (let i = 0; i < 7; i++) {
                const events = getEventsForDate(day);
                const isCurrentMonth = isSameMonth(day, monthStart);
                daysInRow.push(
                  <div
                    key={day.toString()}
                    className={cn(
                      "min-h-[100px] border-r border-b border-white/5 p-3 transition-all",
                      !isCurrentMonth && "opacity-10 grayscale",
                      isToday(day) && "bg-blue-500/5"
                    )}
                  >
                    <div className={cn("text-[10px] font-black font-mono mb-2", isToday(day) ? "text-blue-400" : "text-slate-600")}>
                      {format(day, "dd")}
                    </div>
                    <div className="space-y-1">
                      {events.map((event, idx) => (
                        <div
                          key={idx}
                          className={cn(
                            "text-[9px] font-black px-2 py-1 rounded uppercase tracking-tighter border",
                            isCentralBankEvent(event)
                              ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                              : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                          )}
                        >
                          {isCentralBankEvent(event) ? `${event.flag} ${event.name}` : event.ticker}
                        </div>
                      ))}
                    </div>
                  </div>
                );
                day = addDays(day, 1);
              }
              rows.push(<div key={day.toString()} className="grid grid-cols-7">{daysInRow}</div>);
            }
            return rows;
          })()}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-6 p-6 bg-black/20 rounded-2xl border border-white/5 items-center">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Monetary Policy</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Asset Specific Events</span>
        </div>
        <div className="ml-auto text-[9px] font-mono text-slate-600 flex items-center gap-2">
          <Info className="w-3 h-3" />
          CALENDAR SYNCED TO ACTIVE NODE TICKERS
        </div>
      </div>
    </motion.div>
  );
}