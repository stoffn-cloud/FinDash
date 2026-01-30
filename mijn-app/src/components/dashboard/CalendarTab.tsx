import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";
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

// ----- Types -----
type Holding = {
  ticker: string;
  [key: string]: any;
};

type AssetClass = {
  name: string;
  holdings?: Holding[];
};

interface CalendarTabProps {
  assetClasses?: AssetClass[];
}

// Event types
type CentralBankEvent = {
  date: string;
  name: string;
  flag: string;
  type: "central_bank";
};

type EarningsEvent = {
  date: string;
  name: string;
  ticker: string;
  type: "earnings";
};

type CalendarEvent = CentralBankEvent | EarningsEvent;

// Type guard
const isCentralBankEvent = (event: CalendarEvent): event is CentralBankEvent =>
  event.type === "central_bank";

// ----- Statische data -----
const CENTRAL_BANK_EVENTS: CentralBankEvent[] = [
  { date: "2026-01-29", name: "Fed", flag: "🇺🇸", type: "central_bank" },
  { date: "2026-02-06", name: "BoE", flag: "🇬🇧", type: "central_bank" },
  { date: "2026-02-18", name: "RBA", flag: "🇦🇺", type: "central_bank" },
  { date: "2026-03-06", name: "ECB", flag: "🇪🇺", type: "central_bank" },
];

const GLOBAL_EARNINGS_DATABASE: EarningsEvent[] = [
  { date: "2026-01-28", name: "Apple", ticker: "AAPL", type: "earnings" },
  { date: "2026-01-29", name: "Microsoft", ticker: "MSFT", type: "earnings" },
  { date: "2026-01-30", name: "Tesla", ticker: "TSLA", type: "earnings" },
  { date: "2026-02-11", name: "NVIDIA", ticker: "NVDA", type: "earnings" },
  { date: "2026-02-15", name: "Goldman Sachs", ticker: "GS", type: "earnings" },
];

export default function CalendarTab({ assetClasses = [] }: CalendarTabProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // --- Haal tickers op van je holdings ---
  const myTickers = useMemo(() => {
    const tickers = new Set<string>();
    assetClasses.forEach((ac) => {
      ac.holdings?.forEach((holding) => {
        if (holding.ticker) tickers.add(holding.ticker);
      });
    });
    return tickers;
  }, [assetClasses]);

  // --- Filter events ---
  const allEvents = useMemo<CalendarEvent[]>(() => {
    const relevantEarnings = GLOBAL_EARNINGS_DATABASE.filter((event) =>
      myTickers.has(event.ticker)
    );
    return [...CENTRAL_BANK_EVENTS, ...relevantEarnings];
  }, [myTickers]);

  const getEventsForDate = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return allEvents.filter((event) => event.date === dateStr);
  };

  // ----- Rendering helpers -----
  const renderHeader = () => (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h2 className="text-2xl font-bold text-white capitalize">
          {format(currentMonth, "MMMM yyyy", { locale: nl })}
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          {myTickers.size > 0
            ? `Kalender voor jouw ${myTickers.size} holdings`
            : "Economische kalender"}
        </p>
      </div>
      <div className="flex gap-2 bg-slate-800/50 p-1 rounded-xl border border-slate-700/50">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="text-slate-400"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="text-slate-400"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );

  const renderDays = () => {
    const days = ["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"];
    return (
      <div className="grid grid-cols-7 mb-2 border-b border-slate-700/50">
        {days.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-bold uppercase text-slate-500 py-3"
          >
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const events = getEventsForDate(day);
        const isCurrentMonth = isSameMonth(day, monthStart);

        days.push(
          <div
            key={day.toString()}
            className={cn(
              "min-h-[110px] border-r border-b border-slate-700/30 p-2 transition-all",
              !isCurrentMonth && "bg-slate-900/20 opacity-30",
              isToday(day) && "bg-blue-500/5"
            )}
          >
            <div
              className={cn(
                "text-xs font-semibold mb-2",
                isToday(day) ? "text-blue-400" : "text-slate-500"
              )}
            >
              {format(day, "d")}
            </div>
            <div className="space-y-1">
              {events.map((event, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "text-[10px] px-2 py-1 rounded border truncate",
                    isCentralBankEvent(event)
                      ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  )}
                >
                  {isCentralBankEvent(event)
                    ? `${event.flag} ${event.name}`
                    : event.ticker}
                </div>
              ))}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div
          key={day.toString()}
          className="grid grid-cols-7 first:border-t border-l border-slate-700/30"
        >
          {days}
        </div>
      );
      days = [];
    }

    return (
      <div className="rounded-xl overflow-hidden border-t border-slate-700/30">
        {rows}
      </div>
    );
  };

  // ----- Render -----
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="rounded-2xl bg-slate-900/50 border border-slate-700/50 p-6 backdrop-blur-md">
        {renderHeader()}
        {renderDays()}
        {renderCells()}
      </div>

      <div className="flex flex-wrap gap-4 p-4 bg-slate-800/30 rounded-xl border border-slate-700/50 items-center">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-500" />
          <span className="text-xs text-slate-400 font-medium">Centrale Banken</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-xs text-slate-400 font-medium">Jouw Earnings</span>
        </div>
        <div className="ml-auto text-[10px] text-slate-500 flex items-center gap-1">
          <Info className="w-3 h-3" />
          Data gebaseerd op jouw holdings in mockData.js
        </div>
      </div>
    </motion.div>
  );
}
