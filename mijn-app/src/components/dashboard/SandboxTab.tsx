"use client"

import React, { useMemo } from "react"
import { useForm, useWatch } from "react-hook-form"
import { 
  Calculator, 
  TrendingUp, 
  RefreshCcw,
  DollarSign,
  Zap,
  Info,
  Calendar,
  Percent
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

import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion";

interface SandboxTabProps {
  portfolio?: any;
}

export default function SandboxTab({ portfolio }: SandboxTabProps) {
  const form = useForm({
    defaultValues: {
      initialCapital: portfolio?.total_value || 10000,
      monthlyInflow: 500,
      years: 25,
      expectedReturn: 7.5,
      inflationAdjusted: true,
    },
  })

  const values = useWatch({ control: form.control })

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
    <div className="space-y-8 pb-10">
      {/* Header met Simulatie Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.1)]">
            <Zap className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic">Growth Sandbox</h2>
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-1 italic">
              Strategy Node: <span className="text-slate-300 font-bold">{portfolio?.name || "Global Growth"}</span>
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 bg-black/40 border border-white/5 p-2 pr-5 rounded-2xl">
          <div className="px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_#3b82f6]" />
            <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">Projection Active</span>
          </div>
          <span className="text-[9px] font-mono text-slate-600 uppercase tracking-tighter">Engine: Compound v4.2</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Input Panel (Simulation Engine) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-black/20 border border-white/5 rounded-3xl p-8 backdrop-blur-xl relative overflow-hidden group">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-3">
                <Calculator className="w-4 h-4 text-blue-500" />
                <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Simulation Parameters</h2>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => form.reset()} 
                className="h-8 w-8 text-slate-600 hover:text-white hover:bg-white/5 rounded-lg transition-all"
              >
                <RefreshCcw className="w-3.5 h-3.5" />
              </Button>
            </div>

            <Form {...form}>
              <form className="space-y-8">
                <FormField
                  control={form.control}
                  name="initialCapital"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-[10px] text-slate-500 font-black uppercase tracking-widest italic">Capital Origin</FormLabel>
                      <FormControl>
                        <div className="relative group/input">
                          <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600 group-focus-within/input:text-blue-500 transition-colors" />
                          <Input {...field} type="number" className="h-12 bg-white/[0.02] border-white/5 pl-10 font-mono text-sm text-white focus:border-blue-500/50 rounded-xl transition-all" />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="monthlyInflow"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-[10px] text-slate-500 font-black uppercase tracking-widest italic">Recurrent Contribution</FormLabel>
                      <FormControl>
                        <div className="relative group/input">
                          <TrendingUp className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600 group-focus-within/input:text-emerald-500 transition-colors" />
                          <Input {...field} type="number" className="h-12 bg-white/[0.02] border-white/5 pl-10 font-mono text-sm text-white focus:border-emerald-500/50 rounded-xl transition-all" />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="years"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-[10px] text-slate-500 font-black uppercase tracking-widest italic">Horizon (Y)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-600" />
                            <Input {...field} type="number" className="h-12 bg-white/[0.02] border-white/5 pl-10 font-mono text-center text-sm text-white rounded-xl" />
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="expectedReturn"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-[10px] text-slate-500 font-black uppercase tracking-widest italic">Exp. Yield %</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Percent className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-600" />
                            <Input {...field} type="number" step="0.1" className="h-12 bg-white/[0.02] border-white/5 pl-10 font-mono text-center text-sm text-emerald-400 font-bold rounded-xl" />
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="inflationAdjusted"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-4 space-y-0 rounded-2xl border border-white/5 p-5 bg-white/[0.02] hover:bg-white/[0.04] transition-all cursor-pointer group/check">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} className="border-white/20 data-[state=checked]:bg-blue-600" />
                      </FormControl>
                      <div className="space-y-1">
                        <FormLabel className="text-xs font-black text-slate-300 uppercase tracking-tight cursor-pointer">Inflation Hedge</FormLabel>
                        <p className="text-[9px] text-slate-600 font-mono uppercase tracking-tighter italic">Adjusted for 2.0% Real Value loss</p>
                      </div>
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>
        </div>

        {/* Right: Output & Chart */}
        <div className="lg:col-span-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl relative overflow-hidden group shadow-[0_20px_50px_rgba(37,99,235,0.2)]">
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />
              <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-100 mb-2 italic">Terminal Value Node</p>
                <h3 className="text-5xl font-mono font-black italic tracking-tighter text-white">
                  ${finalBalance.toLocaleString()}
                </h3>
                <div className="mt-6 flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-xl w-fit border border-white/10">
                  <TrendingUp className="w-3.5 h-3.5 text-blue-100" />
                  <span className="text-[9px] font-black text-blue-100 uppercase tracking-widest leading-none">Yield Optimized</span>
                </div>
              </div>
            </div>
            
            <div className="p-8 bg-black/20 border border-white/5 rounded-3xl backdrop-blur-xl flex flex-col justify-center">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 italic tracking-widest">Confidence Index</p>
              <div className="flex items-end gap-3 mb-4">
                <h3 className="text-3xl font-black italic tracking-tighter text-white uppercase">Optimal</h3>
                <p className="text-[10px] text-emerald-500 mb-1 font-mono font-black uppercase tracking-tighter leading-none px-2 py-1 bg-emerald-500/10 rounded-md border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]">92% Prob.</p>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div initial={{width: 0}} animate={{width: '92%'}} transition={{duration: 2}} className="h-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
              </div>
            </div>
          </div>

          

          <div className="bg-black/20 border border-white/5 rounded-3xl p-10 backdrop-blur-xl h-[420px] relative group hover:border-blue-500/30 transition-all duration-500">
            <div className="absolute top-6 left-8 flex items-center gap-3">
               <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]" />
               <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Growth Velocity Vector</span>
            </div>
            
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={projectionData} margin={{ top: 40, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" strokeOpacity={0.03} vertical={false} />
                <XAxis 
                  dataKey="year" 
                  stroke="#475569" 
                  fontSize={10} 
                  fontWeight="900"
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(val) => `Y${val}`}
                  dy={20}
                />
                <YAxis hide domain={['dataMin - 1000', 'dataMax + 1000']} />
                <Tooltip 
                  cursor={{ stroke: '#3b82f6', strokeWidth: 1, strokeDasharray: '4 4' }}
                  content={({ active, payload, label }: any) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-black/90 border border-white/10 backdrop-blur-xl rounded-xl px-5 py-4 shadow-2xl ring-1 ring-white/5">
                          <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em] mb-3">Horizon: Year {label}</p>
                          <p className="text-blue-400 text-xl font-mono font-black italic">${payload[0].value.toLocaleString()}</p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="balance" 
                  stroke="#3b82f6" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorBalance)"
                  animationDuration={2500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}