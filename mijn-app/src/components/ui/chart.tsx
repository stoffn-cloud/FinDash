"use client";
import * as React from "react"
import * as RechartsPrimitive from "recharts"
import { cn } from "@/lib/utils"

const THEMES = { light: "", dark: ".dark" }
const ChartContext = React.createContext(null)

function useChart() {
  const context = React.useContext(ChartContext)
  if (!context) throw new Error("useChart must be used within a <ChartContainer />")
  return context
}

const ChartContainer = React.forwardRef(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId()
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        ref={ref}
        className={cn(
          "flex aspect-video justify-center text-[10px] font-medium",
          // Fintech styling voor Recharts elementen
          "[&_.recharts-cartesian-axis-tick_text]:fill-slate-500 [&_.recharts-cartesian-axis-tick_text]:font-mono",
          "[&_.recharts-cartesian-grid_line]:stroke-slate-800/50 [&_.recharts-cartesian-grid_line]:stroke-[0.5]",
          "[&_.recharts-curve.recharts-tooltip-cursor]:stroke-blue-500/50",
          "[&_.recharts-dot]:stroke-slate-950 [&_.recharts-dot]:stroke-2",
          "[&_.recharts-layer]:outline-none",
          className
        )}
        {...props}>
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
})

const ChartTooltipContent = React.forwardRef((
  { active, payload, className, indicator = "dot", hideLabel = false, label, labelFormatter, color },
  ref
) => {
  const { config } = useChart()

  if (!active || !payload?.length) return null

return (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-center gap-5", // Iets meer ademruimte tussen items
        verticalAlign === "top" ? "pb-4" : "pt-4",
        className
      )}>
      {payload.map((item) => {
        const key = `${nameKey || item.dataKey || "value"}`
        const itemConfig = getPayloadConfigFromPayload(config, item, key)

        return (
          <div
            key={item.value}
            className={cn(
              "flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400"
            )}>
            {itemConfig?.icon && !hideIcon ? (
              <itemConfig.icon className="h-3 w-3" />
            ) : (
              <div
                className="h-1.5 w-1.5 shrink-0 rounded-full" // Ronde dots voor een cleanere look
                style={{
                  backgroundColor: item.color,
                }} />
            )}
            {itemConfig?.label}
          </div>
        )
      })}
    </div>
  )
})
ChartLegendContent.displayName = "ChartLegend"

// DEZE HELPER IS ESSENTIEEL - NIET VERWIJDEREN
function getPayloadConfigFromPayload(config, payload, key) {
  if (typeof payload !== "object" || payload === null) return undefined

  const payloadPayload =
    "payload" in payload &&
    typeof payload.payload === "object" &&
    payload.payload !== null
      ? payload.payload
      : undefined

  let configLabelKey = key

  if (key in payload && typeof payload[key] === "string") {
    configLabelKey = payload[key]
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key] === "string"
  ) {
    configLabelKey = payloadPayload[key]
  }

  return configLabelKey in config ? config[configLabelKey] : config[key]
}

// ALLES EXPORTEREN
export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
}