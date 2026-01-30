"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-4 bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-xs font-bold uppercase tracking-widest text-slate-200",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-slate-800/50 border-slate-700 p-0 opacity-100 hover:bg-slate-700 hover:text-white transition-all"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex mb-2",
        head_cell: "text-slate-500 rounded-md w-8 font-bold text-[10px] uppercase tracking-tighter",
        row: "flex w-full mt-1",
        cell: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-blue-500/10 first:[&:has([aria-selected])]:rounded-l-lg last:[&:has([aria-selected])]:rounded-r-lg",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-lg [&:has(>.day-range-start)]:rounded-l-lg"
            : "[&:has([aria-selected])]:rounded-lg"
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-8 w-8 p-0 font-mono text-xs hover:bg-slate-800 hover:text-white transition-all"
        ),
        day_range_start: "day-range-start",
        day_range_end: "day-range-end",
        day_selected:
          "bg-blue-600 text-white hover:bg-blue-500 hover:text-white focus:bg-blue-600 focus:text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] rounded-lg",
        day_today: "bg-slate-800 text-blue-400 font-bold border border-slate-700/50",
        day_outside:
          "day-outside text-slate-600 opacity-50 aria-selected:bg-blue-500/5 aria-selected:text-slate-500",
        day_disabled: "text-slate-600 opacity-30",
        day_range_middle:
          "aria-selected:bg-blue-500/10 aria-selected:text-blue-200",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={cn("h-4 w-4", className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn("h-4 w-4", className)} {...props} />
        ),
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }