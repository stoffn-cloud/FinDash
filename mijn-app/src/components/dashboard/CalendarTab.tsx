import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Landmark, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, subMonths, isSameMonth, isSameDay, isToday } from "date-fns";

// Central Bank Rate Decision Dates
const CENTRAL_BANK_EVENTS = [
  { date: "2026-01-29", name: "Federal Reserve", flag: "🇺🇸", type: "central_bank" },
  { date: "2026-02-06", name: "Bank of England", flag: "🇬🇧", type: "central_bank" },
  { date: "2026-02-18", name: "RBA", flag: "🇦🇺", type: "central_bank" },
  { date: "2026-03-06", name: "ECB", flag: "🇪🇺", type: "central_bank" },
  { date: "2026-03-12", name: "Bank of Canada", flag: "🇨🇦", type: "central_bank" },
  { date: "2026-03-14", name: "Bank of Japan", flag: "🇯🇵", type: "central_bank" },
  { date: "2026-03-20", name: "SNB", flag: "🇨🇭", type: "central_bank" },
];

// Sample Earnings Dates for Portfolio Holdings
const EARNINGS_EVENTS = [
  { date: "2026-01-28", name: "Apple", ticker: "AAPL", type: "earnings" },
  { date: "2026-01-29", name: "Microsoft", ticker: "MSFT", type: "earnings" },
  { date: "2026-01-30", name: "Tesla", ticker: "TSLA", type: "earnings" },
  { date: "2026-02-04", name: "Amazon", ticker: "AMZN", type: "earnings" },
  { date: "2026-02-05", name: "Alphabet", ticker: "GOOGL", type: "earnings" },
  { date: "2026-02-11", name: "NVIDIA", ticker: "NVDA", type: "earnings" },
  { date: "2026-02-20", name: "Walmart", ticker: "WMT", type: "earnings" },
  { date: "2026-03-05", name: "Broadcom", ticker: "AVGO", type: "earnings" },
];

const ALL_EVENTS = [...CENTRAL_BANK_EVENTS, ...EARNINGS_EVENTS];

export default function CalendarTab({ assetClasses }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getEventsForDate = (date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return ALL_EVENTS.filter(event => event.date === dateStr);
  };

  const renderHeader = () => (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold text-white">
        {format(currentMonth, "MMMM yyyy")}
      </h2>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="bg-slate-800/50 border-slate-700 hover:bg-slate-700/50 text-white"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="bg-slate-800/50 border-slate-700 hover:bg-slate-700/50 text-white"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );

  const renderDays = () => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return (
      <div className="grid grid-cols-7 mb-2">
        {days.map(day => (
          <div key={day} className="text-center text-sm font-medium text-slate-400 py-2">
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
        const cloneDay = day;
        const events = getEventsForDate(day);
        const isCurrentMonth = isSameMonth(day, monthStart);

        days.push(
          <div
            key={day.toString()}
            className={cn(
              "min-h-[100px] border border-slate-700/50 p-2 transition-colors",
              !isCurrentMonth && "bg-slate-900/50",
              isCurrentMonth && "bg-slate-800/30",
              isToday(day) && "border-blue-500/50 bg-blue-500/10"
            )}
          >
            <div className={cn(
              "text-sm font-medium mb-1",
              !isCurrentMonth && "text-slate-600",
              isCurrentMonth && "text-slate-300",
              isToday(day) && "text-blue-400"
            )}>
              {format(day, "d")}
            </div>
            <div className="space-y-1">
              {events.map((event, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "text-xs px-1.5 py-0.5 rounded truncate",
                    event.type === "central_bank" 
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  )}
                  title={event.type === "central_bank" ? `${event.name} Rate Decision` : `${event.name} (${event.ticker}) Earnings`}
                >
                  {event.type === "central_bank" ? (
                    <span>{event.flag} {event.name}</span>
                  ) : (
                    <span>{event.ticker}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7">
          {days}
        </div>
      );
      days = [];
    }
    return <div>{rows}</div>;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/50 border border-slate-700/50 backdrop-blur-xl p-6">
        {renderHeader()}
        {renderDays()}
        {renderCells()}
      </div>

      {/* Legend */}
      <div className="flex gap-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-amber-500/30 border border-amber-500/50" />
          <span className="text-sm text-slate-400">Central Bank Decisions</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-emerald-500/30 border border-emerald-500/50" />
          <span className="text-sm text-slate-400">Earnings Announcements</span>
        </div>
      </div>
    </motion.div>
  );
}