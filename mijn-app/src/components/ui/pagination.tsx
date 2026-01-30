"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button";

const Pagination = ({ className, ...props }) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props} />
)

const PaginationContent = React.forwardRef(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-2", className)}
    {...props} />
))

const PaginationLink = ({ className, isActive, size = "icon", ...props }) => (
  <a
    aria-current={isActive ? "page" : undefined}
    className={cn(
      buttonVariants({
        variant: isActive ? "default" : "ghost",
        size,
      }),
      "text-[11px] font-mono font-bold transition-all rounded-lg border border-transparent",
      isActive && "bg-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)] border-blue-400",
      !isActive && "text-slate-500 hover:bg-slate-800 hover:text-slate-200 hover:border-slate-700",
      className
    )}
    {...props} />
)

const PaginationPrevious = ({ className, ...props }) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    className={cn("gap-1 pl-2.5 uppercase tracking-tighter text-[10px]", className)}
    {...props}>
    <ChevronLeft className="h-4 w-4" />
    <span>Prev</span>
  </PaginationLink>
)

const PaginationNext = ({ className, ...props }) => (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    className={cn("gap-1 pr-2.5 uppercase tracking-tighter text-[10px]", className)}
    {...props}>
    <span>Next</span>
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>
)

const PaginationEllipsis = ({ className, ...props }) => (
  <span
    aria-hidden
    className={cn("flex h-9 w-9 items-center justify-center text-slate-600", className)}
    {...props}>
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
)

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem: ({ ...props }) => <li {...props} />, // Inline shorthand
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
}