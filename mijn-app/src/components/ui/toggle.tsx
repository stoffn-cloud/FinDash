"use client"

import * as React from "react"
import * as TogglePrimitive from "@radix-ui/react-toggle"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

const toggleVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all outline-none focus-visible:ring-1 focus-visible:ring-blue-500/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-3.5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-transparent text-slate-500 hover:bg-slate-900 hover:text-slate-300 data-[state=on]:bg-blue-600/20 data-[state=on]:text-blue-400 data-[state=on]:shadow-[inset_0_0_10px_rgba(59,130,246,0.2)]",
        outline:
          "border border-slate-800 bg-transparent hover:bg-slate-900 hover:text-slate-200 data-[state=on]:border-blue-500/50 data-[state=on]:bg-blue-500/10 data-[state=on]:text-blue-400",
      },
      size: {
        default: "h-9 px-3 min-w-9",
        sm: "h-7 px-2 min-w-7",
        lg: "h-11 px-4 min-w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Toggle = React.forwardRef(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(toggleVariants({ variant, size, className }))}
    {...props} />
))

Toggle.displayName = TogglePrimitive.Root.displayName

export { Toggle, toggleVariants }