"use client"

import * as React from "react"
import * as MenubarPrimitive from "@radix-ui/react-menubar"
import { Check, ChevronRight, Circle } from "lucide-react"

import { cn } from "@/lib/utils"

// Helper componenten
const MenubarMenu = MenubarPrimitive.Menu
const MenubarGroup = MenubarPrimitive.Group
const MenubarPortal = MenubarPrimitive.Portal
const MenubarRadioGroup = MenubarPrimitive.RadioGroup
const MenubarSub = MenubarPrimitive.Sub

const Menubar = React.forwardRef(({ className, ...props }, ref) => (
  <MenubarPrimitive.Root
    ref={ref}
    className={cn(
      "flex h-10 items-center space-x-1 rounded-xl border border-slate-800 bg-slate-950/50 p-1 backdrop-blur-md shadow-2xl",
      className
    )}
    {...props} />
))
Menubar.displayName = MenubarPrimitive.Root.displayName

const MenubarTrigger = React.forwardRef(({ className, ...props }, ref) => (
  <MenubarPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-lg px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 outline-none transition-all focus:bg-blue-600/10 focus:text-blue-400 data-[state=open]:bg-blue-600/20 data-[state=open]:text-blue-400",
      className
    )}
    {...props} />
))

const MenubarContent = React.forwardRef((
  { className, align = "start", alignOffset = -4, sideOffset = 8, ...props },
  ref
) => (
  <MenubarPrimitive.Portal>
    <MenubarPrimitive.Content
      ref={ref}
      align={align}
      alignOffset={alignOffset}
      sideOffset={sideOffset}
      className={cn(
        "z-50 min-w-[12rem] overflow-hidden rounded-xl border border-slate-800 bg-slate-950/90 p-1.5 text-slate-300 shadow-2xl backdrop-blur-2xl animate-in fade-in-0 zoom-in-95",
        className
      )}
      {...props} />
  </MenubarPrimitive.Portal>
))

const MenubarItem = React.forwardRef(({ className, inset, ...props }, ref) => (
  <MenubarPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-pointer select-none items-center rounded-lg px-3 py-2 text-[11px] font-bold uppercase tracking-wider outline-none transition-colors focus:bg-blue-600 focus:text-white data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8",
      className
    )}
    {...props} />
))

const MenubarLabel = React.forwardRef(({ className, inset, ...props }, ref) => (
  <MenubarPrimitive.Label
    ref={ref}
    className={cn(
      "px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500",
      inset && "pl-8",
      className
    )}
    {...props} />
))

const MenubarSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <MenubarPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-slate-800/50", className)}
    {...props} />
))

const MenubarShortcut = ({ className, ...props }) => (
  <span className={cn("ml-auto text-[10px] font-mono tracking-widest text-slate-600", className)} {...props} />
)

export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarLabel,
  MenubarCheckboxItem, // Zelfde logica als ContextMenu
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarPortal,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarGroup,
  MenubarSub,
  MenubarShortcut,
}