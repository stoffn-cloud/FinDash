import * as React from "react"
import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio"

import { cn } from "@/lib/utils"

const AspectRatio = React.forwardRef(({ className, ...props }, ref) => (
  <AspectRatioPrimitive.Root
    ref={ref}
    className={cn(
      "overflow-hidden rounded-2xl border border-slate-800/40 bg-slate-900/20",
      className
    )}
    {...props}
  />
))

AspectRatio.displayName = "AspectRatio"

export { AspectRatio }