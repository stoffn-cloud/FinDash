"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const labelVariants = cva(
  "text-[10px] font-black uppercase tracking-[0.2em] leading-none text-slate-500 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 transition-colors"
)

const Label = React.forwardRef(({ className, ...props }, ref) => (
  <LabelPrimitive.Root 
    ref={ref} 
    className={cn(labelVariants(), "hover:text-slate-400 cursor-pointer", className)} 
    {...props} 
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }