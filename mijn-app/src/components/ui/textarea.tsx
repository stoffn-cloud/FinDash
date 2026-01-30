"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[100px] w-full rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-3 text-sm text-slate-200 shadow-inner transition-all",
        "placeholder:text-slate-600 font-mono tracking-tight",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500/50 focus-visible:bg-slate-900/80 focus-visible:border-blue-500/50",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent",
        className
      )}
      ref={ref}
      {...props} />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }