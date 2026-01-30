"use client"

import * as React from "react"
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu"
import { Check, ChevronRight, Circle } from "lucide-react"

import { cn } from "@/lib/utils"

const ContextMenu = ContextMenuPrimitive.Root
const ContextMenuTrigger = ContextMenuPrimitive.Trigger
const ContextMenuGroup = ContextMenuPrimitive.Group
const ContextMenuPortal = ContextMenuPrimitive.Portal
const ContextMenuSub = ContextMenuPrimitive.Sub
const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup

const ContextMenuSubTrigger = React.forwardRef(({ className, inset, children, ...props }, ref) => (
  <ContextMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-lg px-3 py-2 text-xs font-medium outline-none focus:bg-blue-600/20 focus:text-blue-400 data-[state=open]:bg-blue-600/10 data-[state=open]:text-blue-400",
      inset && "pl-8",
      className
    )}
    {...props}>
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </ContextMenuPrimitive.SubTrigger>
))

const ContextMenuContent = React.forwardRef(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Portal>
    <ContextMenuPrimitive.Content
      ref={ref}
      className={cn(
        "z-50 min-w-[10rem] overflow-hidden rounded-xl border border-slate-800 bg-slate-950/90 p-1.5 text-slate-300 shadow-2xl backdrop-blur-xl animate-in fade-in-0 zoom-in-95",
        className
      )}
      {...props} />
  </ContextMenuPrimitive.Portal>
))

const ContextMenuItem = React.forwardRef(({ className, inset, ...props }, ref) => (
  <ContextMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-pointer select-none items-center rounded-lg px-3 py-2 text-[11px] font-bold uppercase tracking-wider outline-none transition-colors focus:bg-blue-600 focus:text-white data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8",
      className
    )}
    {...props} />
))

const ContextMenuLabel = React.forwardRef(({ className, inset, ...props }, ref) => (
  <ContextMenuPrimitive.Label
    ref={ref}
    className={cn(
      "px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500",
      inset && "pl-8",
      className
    )}
    {...props} />
))

const ContextMenuSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-slate-800/50", className)}
    {...props} />
))

const ContextMenuShortcut = ({ className, ...props }) => {
  return (
    <span
      className={cn(
        "ml-auto text-[10px] font-mono tracking-widest text-slate-600",
        className
      )}
      {...props} />
  )
}

// ... overige onderdelen (CheckboxItem, RadioItem) volgen dezelfde stijl-logica
export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
}