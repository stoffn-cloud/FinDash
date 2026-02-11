"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  format,
  startOfWeek,
  addDays,
  isToday,
  startOfToday,
} from "date-fns";
import { nl } from "date-fns/locale";

interface CalendarTabProps {
  assetClasses?: any[]; 
}

export default function CalendarTab({ assetClasses = [] }: CalendarTabProps) {
  // We starten de weergave bij het begin van de huidige week
  const [startDate, setStartDate] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));

  // Genereer de 7 dagen van de week
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(startDate, i));

  const nextWeek = () => setStartDate(addDays(startDate, 7));
  const prevWeek = () => setStartDate(addDays(startDate, -7));
  const resetToToday = () => setStartDate(startOfWeek(new Date(), { weekStartsOn: 1 }));

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="space-y-6"
    >
      {/* --- HEADER --- */}
      <div className="flex items-center justify-between bg-slate-900/40 border border-white/5 p-6 rounded-[2rem] backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <CalendarIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white italic uppercase tracking-tighter">
              Week {format(startDate, "w")} — {format(startDate, "yyyy")}
            </h2>
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
              FinDash Economic Scheduler
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-950/50 p-1.5 rounded-2xl border border-white/5">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={prevWeek}
            className="text-slate-400 hover:text-white"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={resetToToday}
            className="text-[10px] font-black uppercase px-3 text-slate-400 hover:text-blue-400"
          >
            Today
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={nextWeek}
            className="text-slate-400 hover:text-white"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* --- WEEK GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
        {weekDays.map((day) => (
          <div
            key={day.toString()}
            className={cn(
              "min-h-[200px] rounded-[1.5rem] border transition-all p-4 flex flex-col gap-4",
              isToday(day) 
                ? "bg-blue-600/5 border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.05)]" 
                : "bg-slate-900/20 border-white/5 hover:border-white/10"
            )}
          >
            {/* Dag Label */}
            <div className="flex flex-col border-b border-white/5 pb-3">
              <span className={cn(
                "text-[10px] font-black uppercase tracking-widest",
                isToday(day) ? "text-blue-400" : "text-slate-500"
              )}>
                {format(day, "EEEE", { locale: nl })}
              </span>
              <span className="text-xl font-bold text-white tracking-tighter">
                {format(day, "d MMM")}
              </span>
            </div>

            {/* Placeholder voor Events */}
            <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-white/[0.02] rounded-xl">
              <Clock className="w-4 h-4 text-slate-800 mb-2" />
              <span className="text-[8px] font-mono text-slate-700 uppercase tracking-widest">No Events</span>
            </div>
          </div>
        ))}
      </div>

      {/* --- VOETNOOT / SYNC STATUS --- */}
      <div className="flex items-center justify-center py-4">
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/40 border border-white/5 rounded-full">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[9px] font-mono text-slate-500 uppercase tracking-[0.2em]">
            System Online — Ready to sync macro-node
          </span>
        </div>
      </div>
    </motion.div>
  );
}