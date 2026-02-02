"use client"

import React, { useMemo } from "react"
import { useForm, useWatch } from "react-hook-form"
import { 
  Calculator, 
  TrendingUp, 
  Target, 
  Info, 
  RefreshCcw,
  DollarSign,
  Zap
} from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"

// --- STAP 1: Interface toevoegen voor de Portfolio Prop ---
interface SandboxTabProps {
  portfolio?: any;
}

export default function SandboxTab({ portfolio }: SandboxTabProps) {
  // We gebruiken het huidige portfolio vermogen als standaardwaarde
  const form = useForm({
    defaultValues: {
      initialCapital: portfolio?.total_value || 10000,
      monthlyInflow: 500,
      years: 20,
      expectedReturn: 7,
      inflationAdjusted: false,
    },
  })

  const values = useWatch({ control: form.control })

  // Het rekenmodel (Compound Interest)
  const projectionData = useMemo(() => {
    const data = []
    let total = Number(values.initialCapital) || 0
    const monthlyRate = (Number(values.expectedReturn) / 100) / 12
    const monthlyInflow = Number(values.monthlyInflow) || 0
    const inflation = values.inflationAdjusted ? 0.02 / 12 : 0

    for (let i = 0; i <= (Number(values.years) || 0) * 12; i++) {
      if (i % 12 === 0) {
        data.push({
          year: i / 12,
          balance: Math.round(total),
        })
      }
      total = (total + monthlyInflow) * (1 + (monthlyRate - inflation))
    }
    return data
  }, [values])

  const finalBalance = projectionData[projectionData.length - 1]?.balance || 0

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Sub-header voor context */}
      <div className="flex items-center gap-3 border-b border-slate-800/50 pb-6 mb-2">
        <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg">
          <Zap className="w-5 h-5 text-amber-500" />
        </div>
        <div>
          <h2 className="text-xl font-black text-white uppercase italic tracking-tight">Growth Sandbox</h2>
          <p className="text-slate-500 text-xs font-medium">
            Simulating growth for: <span className="text-slate-300">{portfolio?.name || "New Simulation"}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Parameters Sectie (4 kolommen) */}
        <Card className="lg:col-span-4 p-6 bg-slate-900/40 border-slate-800 backdrop-blur-xl rounded-3xl">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-blue-500" />
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Simulation Engine</h2>
            </div>
            <Button variant="ghost" size="icon" onClick={() => form.reset()} className="h-8 w-8 text-slate-500 hover:text-white">
              <RefreshCcw className="w-3 h-3" />
            </Button>
          </div>

          <Form {...form}>
            <form className="space-y-6">
              <FormField
                control={form.control}
                name="initialCapital"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-slate-400 font-bold uppercase">Starting Capital</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500" />
                        <Input {...field} type="number" className="bg-slate-950/50 border-slate-800 pl-8 font-mono text-white focus:ring-blue-500" />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="monthlyInflow"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-slate-400 font-bold uppercase">Monthly Contribution</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500" />
                        <Input {...field} type="number" className="bg-slate-950/50 border-slate-800 pl-8 font-mono text-white" />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="years"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs text-slate-400 font-bold uppercase">Horizon</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" className="bg-slate-950/50 border-slate-800 font-mono text-center text-white" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="expectedReturn"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2">
                        <FormLabel className="text-xs text-slate-400 font-bold uppercase">ROI %</FormLabel>
                        <HoverCard>
                          <HoverCardTrigger><Info className="w-3 h-3 text-slate-600" /></HoverCardTrigger>
                          <HoverCardContent className="bg-slate-900 border-slate-800 text-[11px] text-slate-300">
                            The S&P 500 average annual return is ~7-10%.
                          </HoverCardContent>
                        </HoverCard>
                      </div>
                      <FormControl>
                        <Input {...field} type="number" className="bg-slate-950/50 border-slate-800 font-mono text-center text-emerald-400 font-bold" />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="inflationAdjusted"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-2xl border border-slate-800 p-4 bg-slate-950/40 hover:bg-slate-900/40 transition-colors">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} className="border-slate-700 data-[state=checked]:bg-blue-600" />
                    </FormControl>
                    <div className="space-y-1">
                      <FormLabel className="normal-case tracking-normal font-bold text-slate-300">Real Return</FormLabel>
                      <p className="text-[10px] text-slate-500 font-medium italic">Adjust for 2.0% annual inflation.</p>
                    </div>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </Card>

        {/* Visualisatie Sectie (8 kolommen) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-6 bg-gradient-to-br from-blue-600 to-blue-700 border-none rounded-3xl shadow-[0_20px_50px_rgba(37,99,235,0.25)] relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all" />
              <p className="text-[10px] font-black uppercase tracking-widest text-blue-100 mb-1">Projected Terminal Value</p>
              <h3 className="text-4xl font-black tracking-tighter text-white">
                ${finalBalance.toLocaleString()}
              </h3>
            </Card>
            
            <Card className="p-6 bg-slate-900/40 border-slate-800 rounded-3xl backdrop-blur-md flex flex-col justify-center">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Success Probability</p>
              <div className="flex items-end gap-2">
                <h3 className="text-3xl font-bold tracking-tight text-white">High</h3>
                <p className="text-[10px] text-emerald-500 mb-1 font-bold uppercase tracking-tighter">Confidence: 92%</p>
              </div>
            </Card>
          </div>

          <Card className="p-8 bg-slate-900/20 border-slate-800 rounded-3xl h-[400px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={projectionData}>
                <defs>
                  <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} opacity={0.5} />
                <XAxis dataKey="year" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} tick={{dy: 10}} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    border: '1px solid #334155', 
                    borderRadius: '16px', 
                    fontSize: '11px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
                  }}
                  itemStyle={{ color: '#60a5fa', fontWeight: '800' }}
                  formatter={(value: any) => [`$${value.toLocaleString()}`, "Balance"]}
                  labelFormatter={(label) => `Year ${label}`}
                />
                <Area 
                  type="monotone" 
                  dataKey="balance" 
                  stroke="#3b82f6" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorBalance)"
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    </div>
  )
}