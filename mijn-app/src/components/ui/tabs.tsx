"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-start rounded-xl bg-slate-950/40 p-1 text-slate-500 border border-slate-800/50 backdrop-blur-md",
      className
    )}
    {...props} />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-1.5 text-[11px] font-black uppercase tracking-wider transition-all outline-none",
      "hover:text-slate-300",
      "data-[state=active]:bg-blue-600/10 data-[state=active]:text-blue-400 data-[state=active]:shadow-[inset_0_0_15px_rgba(59,130,246,0.1)]",
      "relative data-[state=active]:after:absolute data-[state=active]:after:bottom-[-4px] data-[state=active]:after:h-[2px] data-[state=active]:after:w-1/2 data-[state=active]:after:bg-blue-500 data-[state=active]:after:shadow-[0_0_8px_#3b82f6] data-[state=active]:after:rounded-full",
      "disabled:pointer-events-none disabled:opacity-50",
      className
    )}
    {...props} />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-4 ring-offset-background focus-visible:outline-none",
      className
    )}
    {...props} />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }