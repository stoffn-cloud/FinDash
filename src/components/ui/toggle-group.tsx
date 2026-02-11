"use client"

import * as React from "react"
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/* -------------------------------------------------------
 * Variants
 * ----------------------------------------------------- */

const toggleVariants = cva(
  "inline-flex items-center justify-center rounded-lg text-[10px] font-black uppercase tracking-widest transition-all outline-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-transparent text-slate-500 hover:text-slate-200 data-[state=on]:bg-blue-600/10 data-[state=on]:text-blue-400 data-[state=on]:shadow-[0_0_15px_rgba(59,130,246,0.1)]",
        outline:
          "border border-slate-800 bg-transparent hover:bg-slate-900 hover:text-slate-200 data-[state=on]:bg-slate-800 data-[state=on]:text-white",
      },
      size: {
        default: "h-9 px-3",
        sm: "h-7 px-2",
        lg: "h-11 px-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

type ToggleVariants = VariantProps<typeof toggleVariants>

/* -------------------------------------------------------
 * Context
 * ----------------------------------------------------- */

type ToggleGroupContextValue = {
  variant?: ToggleVariants["variant"]
  size?: ToggleVariants["size"]
}

const ToggleGroupContext =
  React.createContext<ToggleGroupContextValue>({})

/* -------------------------------------------------------
 * ToggleGroup
 * ----------------------------------------------------- */

const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> &
    ToggleVariants
>(({ className, variant, size, children, ...props }, ref) => (
  <ToggleGroupPrimitive.Root
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center gap-1 rounded-xl bg-slate-950/40 p-1 border border-slate-800/50 backdrop-blur-md",
      className
    )}
    {...props}
  >
    <ToggleGroupContext.Provider value={{ variant, size }}>
      {children}
    </ToggleGroupContext.Provider>
  </ToggleGroupPrimitive.Root>
))

ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName

/* -------------------------------------------------------
 * ToggleGroupItem
 * ----------------------------------------------------- */

const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> &
    ToggleVariants
>(({ className, children, variant, size, ...props }, ref) => {
  const context = React.useContext(ToggleGroupContext)

  return (
    <ToggleGroupPrimitive.Item
      ref={ref}
      className={cn(
        toggleVariants({
          variant: context.variant ?? variant,
          size: context.size ?? size,
        }),
        className
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  )
})

ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName

/* -------------------------------------------------------
 * Exports
 * ----------------------------------------------------- */

export { ToggleGroup, ToggleGroupItem }
