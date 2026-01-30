"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-xl border border-slate-800 bg-slate-950/50 px-3 py-2 text-sm text-slate-200 shadow-inner transition-all duration-200",
        "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-slate-200",
        "placeholder:text-slate-600",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500/50 focus-visible:border-blue-500/50 focus-visible:bg-slate-900/80",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props} />
  )
})
Input.displayName = "Input"

export { Input }