"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { PanelLeft } from "lucide-react"

import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const SIDEBAR_COOKIE_NAME = "sidebar_state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_WIDTH = "16rem"
const SIDEBAR_WIDTH_MOBILE = "18rem"
const SIDEBAR_WIDTH_ICON = "3.5rem"
const SIDEBAR_KEYBOARD_SHORTCUT = "b"

const SidebarContext = React.createContext(null)

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) throw new Error("useSidebar must be used within a SidebarProvider.")
  return context
}

const SidebarProvider = React.forwardRef((
  { defaultOpen = true, open: openProp, onOpenChange: setOpenProp, className, style, children, ...props },
  ref
) => {
  const isMobile = useIsMobile()
  const [openMobile, setOpenMobile] = React.useState(false)
  const [_open, _setOpen] = React.useState(defaultOpen)
  const open = openProp ?? _open

  const setOpen = React.useCallback((value) => {
    const openState = typeof value === "function" ? value(open) : value
    if (setOpenProp) {
      setOpenProp(openState)
    } else {
      _setOpen(openState)
    }
    document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
  }, [setOpenProp, open])

  const toggleSidebar = React.useCallback(() => {
    return isMobile ? setOpenMobile((o) => !o) : setOpen((o) => !o)
  }, [isMobile, setOpen])

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === SIDEBAR_KEYBOARD_SHORTCUT && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        toggleSidebar()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [toggleSidebar])

  const state = open ? "expanded" : "collapsed"
  const contextValue = React.useMemo(() => ({
    state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar,
  }), [state, open, setOpen, isMobile, openMobile, toggleSidebar])

  return (
    <SidebarContext.Provider value={contextValue}>
      <TooltipProvider delayDuration={0}>
        <div
          style={{ "--sidebar-width": SIDEBAR_WIDTH, "--sidebar-width-icon": SIDEBAR_WIDTH_ICON, ...style }}
          className={cn("group/sidebar-wrapper flex min-h-svh w-full transition-colors duration-300", className)}
          ref={ref}
          {...props}
        >
          {children}
        </div>
      </TooltipProvider>
    </SidebarContext.Provider>
  )
})
SidebarProvider.displayName = "SidebarProvider"

const Sidebar = React.forwardRef((
  { side = "left", variant = "sidebar", collapsible = "offcanvas", className, children, ...props },
  ref
) => {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar()

  if (collapsible === "none") {
    return (
      <div className={cn("flex h-full w-[--sidebar-width] flex-col bg-slate-950/50 border-r border-slate-800", className)} ref={ref} {...props}>
        {children}
      </div>
    )
  }

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
        <SheetContent
          data-sidebar="sidebar"
          data-mobile="true"
          className="w-[--sidebar-width] bg-slate-950/90 backdrop-blur-2xl p-0 text-slate-200 [&>button]:hidden border-r-slate-800"
          style={{ "--sidebar-width": SIDEBAR_WIDTH_MOBILE }}
          side={side}
        >
          <div className="flex h-full w-full flex-col">{children}</div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <div
      ref={ref}
      className="group peer hidden md:block"
      data-state={state}
      data-collapsible={state === "collapsed" ? collapsible : ""}
      data-variant={variant}
      data-side={side}
    >
      <div className={cn(
        "relative h-svh w-[--sidebar-width] bg-transparent transition-[width] duration-300 ease-in-out",
        "group-data-[collapsible=offcanvas]:w-0",
        "group-data-[collapsible=icon]:w-[--sidebar-width-icon]"
      )} />
      <div
        className={cn(
          "fixed inset-y-0 z-10 hidden h-svh w-[--sidebar-width] transition-[left,right,width] duration-300 ease-in-out md:flex",
          side === "left" ? "left-0" : "right-0",
          variant === "floating" || variant === "inset" ? "p-3" : "border-r border-slate-800",
          "group-data-[collapsible=icon]:w-[--sidebar-width-icon]",
          className
        )}
        {...props}
      >
        <div
          data-sidebar="sidebar"
          className="flex h-full w-full flex-col bg-slate-950/40 backdrop-blur-2xl group-data-[variant=floating]:rounded-2xl group-data-[variant=floating]:border group-data-[variant=floating]:border-slate-800 group-data-[variant=floating]:shadow-2xl"
        >
          {children}
        </div>
      </div>
    </div>
  )
})
Sidebar.displayName = "Sidebar"

const SidebarTrigger = React.forwardRef(({ className, onClick, ...props }, ref) => {
  const { toggleSidebar } = useSidebar()
  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      className={cn("h-8 w-8 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10", className)}
      onClick={(e) => { onClick?.(e); toggleSidebar() }}
      {...props}
    >
      <PanelLeft className="size-4" />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
})

const SidebarHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col gap-2 p-4", className)} {...props} />
))

const SidebarContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex min-h-0 flex-1 flex-col gap-2 overflow-auto p-2", className)} {...props} />
))

const SidebarGroupLabel = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex h-8 shrink-0 items-center px-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 transition-opacity duration-200",
      "group-data-[collapsible=icon]:opacity-0",
      className
    )}
    {...props}
  />
))

const sidebarMenuButtonVariants = cva(
  "peer/menu-button flex w-full items-center gap-3 overflow-hidden rounded-xl p-2.5 text-left text-[11px] font-bold uppercase tracking-wider outline-none transition-all hover:bg-blue-600/10 hover:text-blue-400 focus-visible:ring-1 focus-visible:ring-blue-500 active:scale-[0.98] disabled:opacity-50 data-[active=true]:bg-blue-600/20 data-[active=true]:text-blue-400 data-[active=true]:shadow-[inset_3px_0_0_0_#3b82f6]",
  {
    variants: {
      variant: {
        default: "text-slate-400",
        outline: "border border-slate-800 bg-slate-900/50 hover:border-blue-500/50",
      },
      size: {
        default: "h-10",
        sm: "h-8 text-[10px]",
        lg: "h-12",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
)

const SidebarMenuButton = React.forwardRef((
  { asChild = false, isActive = false, variant = "default", size = "default", tooltip, className, ...props },
  ref
) => {
  const Comp = asChild ? Slot : "button"
  const { state, isMobile } = useSidebar()
  const button = (
    <Comp
      ref={ref}
      data-active={isActive}
      className={cn(sidebarMenuButtonVariants({ variant, size }), className)}
      {...props}
    />
  )

  if (!tooltip) return button

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent side="right" align="center" hidden={state !== "collapsed" || isMobile}>
        {tooltip}
      </TooltipContent>
    </Tooltip>
  )
})

const SidebarRail = React.forwardRef(({ className, ...props }, ref) => {
  const { toggleSidebar } = useSidebar()
  return (
    <button
      ref={ref}
      onClick={toggleSidebar}
      className={cn(
        "absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all hover:after:bg-blue-500/40 after:absolute after:inset-y-0 after:left-1/2 after:w-[1px] group-data-[side=left]:-right-4 sm:flex",
        className
      )}
      {...props}
    />
  )
})

const SidebarSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <Separator ref={ref} className={cn("mx-4 my-2 w-auto bg-slate-800/50", className)} {...props} />
))

// Shorthand exports voor minder complexe componenten
const SidebarFooter = React.forwardRef(({ className, ...props }, ref) => <div ref={ref} className={cn("flex flex-col gap-2 p-4", className)} {...props} />)
const SidebarGroup = React.forwardRef(({ className, ...props }, ref) => <div ref={ref} className={cn("relative flex w-full min-w-0 flex-col p-2", className)} {...props} />)
const SidebarGroupContent = React.forwardRef(({ className, ...props }, ref) => <div ref={ref} className={cn("w-full text-sm", className)} {...props} />)
const SidebarMenu = React.forwardRef(({ className, ...props }, ref) => <ul ref={ref} className={cn("flex w-full min-w-0 flex-col gap-1", className)} {...props} />)
const SidebarMenuItem = React.forwardRef(({ className, ...props }, ref) => <li ref={ref} className={cn("group/menu-item relative", className)} {...props} />)

export {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider,
  SidebarRail, SidebarSeparator, SidebarTrigger, useSidebar,
}