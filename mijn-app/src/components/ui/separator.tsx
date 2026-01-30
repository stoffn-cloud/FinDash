"use client"

import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"

import { cn } from "@/lib/utils"

const Separator = React.forwardRef((
  { className, orientation = "horizontal", decorative = true, ...props },
  ref
) => (
  <SeparatorPrimitive.Root
    ref={ref}
    decorative={decorative}
    orientation={orientation}
    className={cn(
      "shrink-0 transition-opacity",
      // Horizontale lijn: subtiele gradiënt van transparant naar slate-800 naar transparant
      orientation === "horizontal" 
        ? "h-[1px] w-full bg-gradient-to-r from-transparent via-slate-800/50 to-transparent" 
        : "h-full w-[1px] bg-gradient-to-b from-transparent via-slate-800/50 to-transparent",
      className
    )}
    {...props} />
))
Separator.displayName = SeparatorPrimitive.Root.displayName

export { Separator }