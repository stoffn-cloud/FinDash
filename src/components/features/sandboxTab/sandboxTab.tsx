"use client"

import React, { useMemo, useEffect } from "react"
import { useForm, useWatch } from "react-hook-form"
import { 
  Calculator, 
  TrendingUp, 
  RefreshCcw,
  DollarSign,
  Zap,
  Calendar,
  Percent,
  Loader2
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
import { motion } from "framer-motion"

// Importeer de types voor consistentie
import { Portfolio } from "@/types"

interface SandboxTabProps {
  portfolio: Portfolio | null;
}

export default function SandboxTab({ portfolio }: SandboxTabProps) {
  // 1. Setup form met fallback naar 0 als portfolio nog null is
  const form = useForm({
    defaultValues: {
      initialCapital: portfolio?.totalValue || 0,
      monthlyInflow: 500,
      years: 25,
      expectedReturn: 7.5,
      inflationAdjusted: true,
    },
  })

  // 2. Update initialCapital zodra het portfolio geladen is uit SQL
  useEffect(() => {
    if (portfolio?.totalValue) {
      form.setValue("initialCapital", Math.round(portfolio.totalValue));
    }
  }, [portfolio?.totalValue, form]);

  const values = useWatch({ control: form.control })

  // 3. De berekeningslogica (Blijft sterk, nu met betere types)
  const projectionData = useMemo(() => {
    const data = []
    let total = Number(values.initialCapital) || 0
    const yearlyRate = Number(values.expectedReturn) / 100
    const monthlyRate = yearlyRate / 12
    const monthlyInflow = Number(values.monthlyInflow) || 0
    // We simuleren 2% inflatie als de hedge uit staat
    const inflationMonthly = values.inflationAdjusted ? 0.02 / 12 : 0

    for (let i = 0; i <= (Number(values.years) || 0) * 12; i++) {
      if (i % 12 === 0) {
        data.push({
          year: i / 12,
          balance: Math.round(total),
        })
      }
      // Compound interest formule met inflatie-correctie
      total = (total + monthlyInflow) * (1 + (monthlyRate - inflationMonthly))
    }
    return data
  }, [values])

  const finalBalance = projectionData[projectionData.length - 1]?.balance || 0

  // 4. Loading state als we nog op de SQL engine wachten
  if (!portfolio) {
    return (
      <div className="h-[400px] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
        <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Waking up Compound Engine...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Header sectie (ongewijzigd qua visuals, maar gekoppeld aan portfolio data) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.1)]">
            <Zap className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic">Growth Sandbox</h2>
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-1 italic">
              Strategy Node: <span className="text-slate-300 font-bold">{portfolio.name}</span>
            </p>
          </div>
        </div>
        
        {/* Status indicator */}
        <div className="flex items-center gap-4 bg-black/40 border border-white/5 p-2 pr-5 rounded-2xl">
          <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]" />
            <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Real-time Sync</span>
          </div>
          <span className="text-[9px] font-mono text-slate-600 uppercase tracking-tighter italic">Source: MySQL Local</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* De rest van je Grid structuur blijft hetzelfde, 
            zorg dat de Form-velden correct gekoppeld blijven */}
        
        {/* Linker Paneel: Inputs */}
        <div className="lg:col-span-4 space-y-6">
            {/* ... Jouw Form code hier ... */}
            <div className="bg-black/20 border border-white/5 rounded-3xl p-8 backdrop-blur-xl relative overflow-hidden group">
               {/* (Zelfde Form code als in jouw voorbeeld, maar nu veilig met de 'portfolio' data) */}
               <Form {...form}>
                 <form className="space-y-8">
                   {/* Capital Origin met dollar-teken */}
                   <FormField
                     control={form.control}
                     name="initialCapital"
                     render={({ field }) => (
                       <FormItem className="space-y-3">
                         <FormLabel className="text-[10px] text-slate-500 font-black uppercase tracking-widest italic">Capital Origin (Current Portfolio)</FormLabel>
                         <FormControl>
                           <div className="relative group/input">
                             <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600 group-focus-within/input:text-blue-500 transition-colors" />
                             <Input {...field} type="number" className="h-12 bg-white/[0.02] border-white/5 pl-10 font-mono text-sm text-white focus:border-blue-500/50 rounded-xl transition-all" />
                           </div>
                         </FormControl>
                       </FormItem>
                     )}
                   />
                   {/* ... Overige velden (Inflow, Years, Return, Checkbox) ... */}
                 </form>
               </Form>
            </div>
        </div>

        {/* Rechter Paneel: Chart & Terminal Value */}
        <div className="lg:col-span-8 space-y-8">
           {/* Terminal Value Card */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl relative overflow-hidden group shadow-[0_20px_50px_rgba(37,99,235,0.2)]">
              <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-100 mb-2 italic">Terminal Value Node</p>
                <h3 className="text-5xl font-mono font-black italic tracking-tighter text-white">
                  ${finalBalance.toLocaleString('nl-NL')}
                </h3>
              </div>
            </div>
            {/* Confidence Index (ongewijzigd) */}
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

          {/* De Grafiek (met verbeterde Tooltip formatter) */}
          <div className="bg-black/20 border border-white/5 rounded-3xl p-10 backdrop-blur-xl h-[420px] relative group hover:border-blue-500/30 transition-all duration-500">
             <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={projectionData} margin={{ top: 40, right: 0, left: 0, bottom: 0 }}>
                {/* ... Grafiek elementen ... */}
                <Area 
                  type="monotone" 
                  dataKey="balance" 
                  stroke="#3b82f6" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorBalance)"
                  animationDuration={2500}
                />
                <Tooltip 
                  cursor={{ stroke: '#3b82f6', strokeWidth: 1, strokeDasharray: '4 4' }}
                  content={({ active, payload, label }: any) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-black/90 border border-white/10 backdrop-blur-xl rounded-xl px-5 py-4 shadow-2xl ring-1 ring-white/5">
                          <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em] mb-3">Horizon: Year {label}</p>
                          <p className="text-blue-400 text-xl font-mono font-black italic">${payload[0].value.toLocaleString('nl-NL')}</p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}