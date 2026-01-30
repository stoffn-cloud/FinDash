"use client"

import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

const Switch = React.forwardRef(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-5 w-10 shrink-0 cursor-pointer items-center rounded-full border-2 border-slate-800 transition-all duration-300",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:ring-offset-0",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "data-[state=checked]:bg-blue-600/20 data-[state=checked]:border-blue-500/50 data-[state=unchecked]:bg-slate-900",
      className
    )}
    {...props}
    ref={ref}>
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-3.5 w-3.5 rounded-full shadow-lg ring-0 transition-all duration-300",
        "data-[state=checked]:translate-x-5 data-[state=checked]:bg-blue-400 data-[state=checked]:shadow-[0_0_12px_rgba(59,130,246,0.8)]",
        "data-[state=unchecked]:translate-x-0 data-[state=unchecked]:bg-slate-600"
      )} />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }