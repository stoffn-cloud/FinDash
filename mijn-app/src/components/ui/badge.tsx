import * as React from "react"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-slate-800 text-slate-200 hover:bg-slate-700",
        secondary:
          "border-transparent bg-slate-100 text-slate-900 hover:bg-slate-200",
        destructive:
          "border-rose-500/20 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20",
        outline: 
          "text-slate-400 border-slate-800 hover:text-white hover:border-slate-700",
        success:
          "border-emerald-500/20 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20",
        warning:
          "border-amber-500/20 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20",
        nitro:
          "border-blue-500/30 bg-blue-600/20 text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.2)] hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  ...props
}) {
  return (<div className={cn(badgeVariants({ variant }), className)} {...props} />);
}

export { Badge, badgeVariants }