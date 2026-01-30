"use client";
import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

const Toaster = ({
  ...props
}) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-slate-950/80 group-[.toaster]:backdrop-blur-xl group-[.toaster]:text-slate-200 group-[.toaster]:border-slate-800 group-[.toaster]:shadow-2xl group-[.toaster]:rounded-2xl",
          description: "group-[.toast]:text-slate-500 group-[.toast]:font-mono group-[.toast]:text-[10px]",
          actionButton:
            "group-[.toast]:bg-blue-600 group-[.toast]:text-white group-[.toast]:font-bold group-[.toast]:text-[10px] group-[.toast]:uppercase",
          cancelButton:
            "group-[.toast]:bg-slate-800 group-[.toast]:text-slate-400",
          // Custom toevoeging voor de Fintech look: een subtiele blauwe indicator aan de zijkant
          content: "relative before:absolute before:-left-4 before:top-0 before:bottom-0 before:w-1 before:bg-blue-500 before:shadow-[0_0_10px_rgba(59,130,246,0.5)] before:rounded-full"
        },
      }}
      {...props} />
  );
}

export { Toaster }