"use client"

import React, { useMemo } from "react"
import { useForm, useWatch } from "react-hook-form"
import { 
  Calculator, 
  TrendingUp, 
  Target, 
  Info, 
  RefreshCcw,
  DollarSign
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
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"

export default function SandboxTab() {
  const form = useForm({
    defaultValues: {
      initialCapital: 10000,
      monthlyInflow: 500,
      years: 20,
      expectedReturn: 7,
      inflationAdjusted: false,
    },
  })

  // Watch alle velden voor real-time berekeningen
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
      // Compound formula: (P + PMT) * (1 + r - inflation)
      total = (total + monthlyInflow) * (1 + (monthlyRate - inflation))
    }
    return data
  }, [values])

  const finalBalance = projectionData[projectionData.length - 1]?.balance || 0

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* Parameters Sectie (4 kolommen) */}
      <Card className="lg:col-span-4 p-6 bg-slate-900/40 border-slate-800 backdrop-blur-xl rounded-3xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-blue-500" />
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-white">Engine Config</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={() => form.reset()} className="h-8 w-8 text-slate-500">
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
                  <FormLabel>Starting Balance</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500" />
                      <Input {...field} type="number" className="pl-8 font-mono" />
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
                  <FormLabel>Monthly Contribution</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500" />
                      <Input {...field} type="number" className="pl-8 font-mono" />
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
                    <FormLabel>Duration (Years)</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" className="font-mono text-center" />
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
                      <FormLabel>Return (%)</FormLabel>
                      <HoverCard>
                        <HoverCardTrigger><Info className="w-3 h-3 text-slate-600" /></HoverCardTrigger>
                        <HoverCardContent className="text-[11px]">S&P 500 gemiddele is ~7-10%.</HoverCardContent>
                      </HoverCard>
                    </div>
                    <FormControl>
                      <Input {...field} type="number" className="font-mono text-center text-emerald-400" />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="inflationAdjusted"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-2xl border border-slate-800 p-4 bg-slate-950/40">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1">
                    <FormLabel className="normal-case tracking-normal font-bold text-slate-300">Net of Inflation</FormLabel>
                    <p className="text-[10px] text-slate-500 font-medium">Subtract 2.0% annual CPI.</p>
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
          <Card className="p-6 bg-blue-600 border-none rounded-3xl shadow-[0_20px_50px_rgba(37,99,235,0.2)]">
            <p className="text-[10px] font-black uppercase tracking-widest text-blue-200/80 mb-1">Projected Wealth</p>
            <h3 className="text-4xl font-black tracking-tighter text-white">
              ${finalBalance.toLocaleString()}
            </h3>
          </Card>
          <Card className="p-6 bg-slate-900/40 border-slate-800 rounded-3xl backdrop-blur-md">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Target Achievement</p>
            <div className="flex items-end gap-2">
              <h3 className="text-3xl font-bold tracking-tight text-white">84%</h3>
              <p className="text-[10px] text-slate-400 mb-1 pb-1">of $1.2M goal</p>
            </div>
          </Card>
        </div>

        <Card className="p-6 bg-slate-900/20 border-slate-800 rounded-3xl h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={projectionData}>
              <defs>
                <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="year" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '10px' }}
                itemStyle={{ color: '#60a5fa', fontWeight: 'bold' }}
              />
              <Area 
                type="monotone" 
                dataKey="balance" 
                stroke="#3b82f6" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorBalance)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  )
}