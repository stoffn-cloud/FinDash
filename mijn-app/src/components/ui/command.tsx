"use client"

import * as React from "react"
import { Command as CommandPrimitive } from "cmdk"
import { Search } from "lucide-react"

import { cn } from "@/lib/utils"
import { Dialog, DialogContent } from "@/components/ui/dialog"

const Command = React.forwardRef(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn(
      "flex h-full w-full flex-col overflow-hidden rounded-2xl bg-slate-950/90 text-slate-200 backdrop-blur-xl border border-slate-800 shadow-2xl",
      className
    )}
    {...props} />
))
Command.displayName = CommandPrimitive.displayName

const CommandDialog = ({ children, ...props }) => {
  return (
    <Dialog {...props}>
      <DialogContent className="overflow-hidden p-0 bg-transparent border-none shadow-none max-w-2xl">
        <Command className="[&_[cmdk-group-heading]]:px-4 [&_[cmdk-group-heading]]:font-bold [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.2em] [&_[cmdk-group-heading]]:text-slate-500 [&_[cmdk-group]]:px-2 [&_[cmdk-input]]:h-14 [&_[cmdk-item]]:px-4 [&_[cmdk-item]]:py-3 [&_[cmdk-item]]:rounded-xl">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  )
}

const CommandInput = React.forwardRef(({ className, ...props }, ref) => (
  <div className="flex items-center border-b border-slate-800 px-4" cmdk-input-wrapper="">
    <Search className="mr-3 h-4 w-4 shrink-0 text-blue-500" />
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        "flex h-12 w-full bg-transparent py-4 text-sm font-medium outline-none placeholder:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props} />
  </div>
))

const CommandItem = React.forwardRef(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-pointer gap-3 select-none items-center px-2 py-2 text-xs font-semibold outline-none transition-all duration-200",
      "data-[selected=true]:bg-blue-600/10 data-[selected=true]:text-blue-400 data-[selected=true]:translate-x-1",
      "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
      className
    )}
    {...props} />
))

const CommandShortcut = ({ className, ...props }) => {
  return (
    <span
      className={cn(
        "ml-auto text-[10px] font-mono tracking-widest text-slate-600 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800",
        className
      )}
      {...props} />
  )
}

// De overige onderdelen (List, Empty, Group, Separator) behouden hun logica 
// maar erven de kleuren en typografie van de container.
export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
}