"use client"

import { GripVertical } from "lucide-react"
import * as ResizablePrimitive from "react-resizable-panels"

import { cn } from "@/lib/utils"

const ResizablePanelGroup = ({
  className,
  ...props
}) => (
  <ResizablePrimitive.PanelGroup
    className={cn(
      "flex h-full w-full data-[panel-group-direction=vertical]:flex-col",
      className
    )}
    {...props} />
)

const ResizablePanel = ResizablePrimitive.Panel

const ResizableHandle = ({
  withHandle,
  className,
  ...props
}) => (
  <ResizablePrimitive.PanelResizeHandle
    className={cn(
      "relative flex w-px items-center justify-center bg-slate-800/50 transition-all duration-200",
      "hover:bg-blue-500/50 data-[state=drag]:bg-blue-500",
      "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:ring-offset-0",
      "data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full",
      className
    )}
    {...props}>
    {withHandle && (
      <div
        className={cn(
          "z-10 flex h-6 w-4 items-center justify-center rounded-md border border-slate-700 bg-slate-900 shadow-xl transition-transform",
          "hover:scale-110 data-[state=drag]:scale-110"
        )}>
        <GripVertical className="h-3 w-3 text-slate-400" />
      </div>
    )}
    {/* Subtiele gloed overlay tijdens interactie */}
    <div className="absolute inset-0 pointer-events-none bg-blue-500/0 data-[state=drag]:bg-blue-500/20 blur-sm transition-all" />
  </ResizablePrimitive.PanelResizeHandle>
)

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }