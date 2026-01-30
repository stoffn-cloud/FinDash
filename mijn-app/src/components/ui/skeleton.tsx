import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-slate-800/40 relative overflow-hidden",
        "after:absolute after:inset-0 after:bg-gradient-to-r after:from-transparent after:via-blue-500/5 after:to-transparent",
        className
      )}
      {...props} 
    />
  )
}

export { Skeleton }
