"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

const Progress = React.forwardRef(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-2 w-full overflow-hidden rounded-full bg-slate-800/50 shadow-inner",
      className
    )}
    {...props}>
    <ProgressPrimitive.Indicator
      className={cn(
        "h-full w-full flex-1 bg-blue-500 transition-all duration-500 ease-in-out",
        "shadow-[0_0_10px_rgba(59,130,246,0.6)]",
        // Optioneel: gradiënt toevoegen voor extra diepte
        "bg-gradient-to-r from-blue-600 to-blue-400"
      )}
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }} />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }