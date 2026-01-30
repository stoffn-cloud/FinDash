import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 active:scale-95 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:bg-blue-500 hover:shadow-[0_0_25px_rgba(37,99,235,0.4)] border-none",
        destructive:
          "bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500 hover:text-white shadow-sm",
        outline:
          "border border-slate-800 bg-slate-900/40 text-slate-300 backdrop-blur-md hover:bg-slate-800 hover:text-white hover:border-slate-700",
        secondary:
          "bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700/50",
        ghost: 
          "text-slate-400 hover:bg-slate-800/50 hover:text-white",
        success:
          "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white shadow-sm",
        glass:
          "bg-white/5 border border-white/10 text-white backdrop-blur-md hover:bg-white/10 transition-all",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 px-3 text-[10px]",
        lg: "h-12 px-10 text-sm",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    (<Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props} />)
  );
})
Button.displayName = "Button"

export { Button, buttonVariants }