"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const Table = React.forwardRef(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto scrollbar-none">
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm", className)}
      {...props} />
  </div>
))
Table.displayName = "Table"

const TableHeader = React.forwardRef(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b [&_tr]:border-slate-800/60 bg-slate-900/20", className)} {...props} />
))

const TableBody = React.forwardRef(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props} />
))

const TableRow = React.forwardRef(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b border-slate-800/40 transition-all duration-200 hover:bg-blue-500/5 data-[state=selected]:bg-blue-500/10",
      className
    )}
    {...props} />
))

const TableHead = React.forwardRef(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-10 px-4 text-left align-middle text-[10px] font-black uppercase tracking-[0.2em] text-slate-500",
      className
    )}
    {...props} />
))

const TableCell = React.forwardRef(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "p-4 align-middle font-medium text-slate-300 [&:has([role=checkbox])]:pr-0",
      "font-mono tracking-tighter", // Cruciaal voor Fintech data
      className
    )}
    {...props} />
))

const TableFooter = React.forwardRef(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn("border-t border-slate-800 bg-slate-950/50 font-bold text-blue-400", className)}
    {...props} />
))

const TableCaption = React.forwardRef(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-[10px] uppercase tracking-widest text-slate-600", className)}
    {...props} />
))

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}