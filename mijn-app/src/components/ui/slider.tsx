"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center py-4", 
      className
    )}
    {...props}>
    <SliderPrimitive.Track
      className="relative h-1 w-full grow overflow-hidden rounded-full bg-slate-800">
      <SliderPrimitive.Range className="absolute h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb
      className={cn(
        "block h-4 w-4 rounded-full border-2 border-blue-500 bg-slate-950 shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all",
        "hover:scale-110 hover:bg-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50",
        "active:scale-95 active:bg-blue-500"
      )} 
    />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }