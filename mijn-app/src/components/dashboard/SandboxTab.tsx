import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Castle, Plus, AlertCircle, Save, Info, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

// UI Components
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Helper components
import AllocationSlider from "./AllocationSlider";
import SecuritySelector from "./SecuritySelector";

const ASSET_CLASS_OPTIONS = [
  { id: "equities", name: "Equities", color: "#3B82F6" },
  { id: "fixed_income", name: "Fixed Income", color: "#10B981" },
  { id: "alternatives", name: "Alternatives", color: "#8B5CF6" },
  { id: "real_estate", name: "Real Estate", color: "#F59E0B" },
  { id: "commodities", name: "Commodities", color: "#EC4899" },
  { id: "cash", name: "Cash", color: "#64748B" },
];

export default function SandboxTab({ portfolio }) {
  const initialAllocations = [
    { id: "equities", percent: 60, securities: [] },
    { id: "fixed_income", percent: 30, securities: [] },
    { id: "cash", percent: 10, securities: [] },
  ];

  const [totalInvestment, setTotalInvestment] = useState(portfolio?.totalValue || 1000000);
  const [currency, setCurrency] = useState("USD");
  const [allocations, setAllocations] = useState(initialAllocations);
  const [expandedClass, setExpandedClass] = useState(null);

  const metrics = useMemo(() => {
    const returns = { equities: 8.5, fixed_income: 4.2, alternatives: 6.5, real_estate: 7.0, commodities: 5.0, cash: 4.5 };
    const betas = { equities: 1.0, fixed_income: 0.2, alternatives: 0.7, real_estate: 0.6, commodities: 0.4, cash: 0 };
    const vols = { equities: 18, fixed_income: 5, alternatives: 15, real_estate: 12, commodities: 20, cash: 1 };

    return allocations.reduce((acc, a) => {
      const weight = a.percent / 100;
      acc.return += weight * (returns[a.id] || 5);
      acc.beta += weight * (betas[a.id] || 0.5);
      acc.vol += weight * (vols[a.id] || 10);
      return acc;
    }, { return: 0, beta: 0, vol: 0 });
  }, [allocations]);

  const totalAllocation = allocations.reduce((sum, a) => sum + a.percent, 0);

  const handleReset = () => {
    setAllocations(initialAllocations);
    setTotalInvestment(portfolio?.totalValue || 1000000);
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header met Acties */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-violet-500/10 border border-violet-500/20 shadow-[0_0_15px_rgba(139,92,246,0.1)]">
            <Castle className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Portfolio Sandbox</h2>
            <p className="text-xs text-slate-500 font-medium">Modeleren & Stress-testen</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Gebruik van de zojuist geüploade AlertDialog */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="border-slate-800 bg-slate-900/50 text-slate-400 hover:text-white">
                <RotateCcw className="w-3.5 h-3.5 mr-2" /> Reset
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Simulatie herstellen?</AlertDialogTitle>
                <AlertDialogDescription>
                  Alle wijzigingen in de huidige sandbox worden overschreven door de beginwaarden.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuleren</AlertDialogCancel>
                <AlertDialogAction onClick={handleReset}>Herstellen</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Button size="sm" className="bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-900/20">
            <Save className="w-3.5 h-3.5 mr-2" /> Scenario Opslaan
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 backdrop-blur-sm shadow-inner">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-3">Kapitaal Investering</p>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-sm">$</span>
              <Input
                type="number"
                value={totalInvestment}
                onChange={(e) => setTotalInvestment(Number(e.target.value))}
                className="pl-7 text-sm font-mono font-bold bg-slate-950/40 border-slate-700 text-white focus:border-blue-500/50 transition-colors"
              />
            </div>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger className="w-20 bg-slate-950/40 border-slate-700 text-[10px] font-bold uppercase">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <MetricCard label="Expected Return" value={`${metrics.return.toFixed(2)}%`} sub="Proj. Jaarlijks" color="text-emerald-400" />
        <MetricCard label="Market Beta" value={metrics.beta.toFixed(2)} sub="Systeem Risico" color="text-blue-400" />
        <MetricCard label="Volatility" value={`${metrics.vol.toFixed(2)}%`} sub="Standard Dev." color="text-amber-400" />
      </div>

      {/* Main Sandbox Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl bg-slate-900/40 border border-slate-800 p-6 shadow-xl">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xs font-bold text-white uppercase tracking-widest">Asset Mix</h3>
              <Badge className={cn(
                "px-3 py-1 font-mono text-[10px]",
                totalAllocation === 100 
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                  : "bg-rose-500/10 text-rose-400 border-rose-500/20 animate-pulse"
              )}>
                {totalAllocation}% Gealloceerd
              </Badge>
            </div>

            <div className="space-y-6">
              {allocations.map((allocation) => (
                <div key={allocation.id} className="group transition-all">
                  <AllocationSlider
                    label={ASSET_CLASS_OPTIONS.find(opt => opt.id === allocation.id)?.name}
                    value={allocation.percent}
                    onChange={(v) => setAllocations(prev => prev.map(a => a.id === allocation.id ? { ...a, percent: v } : a))}
                    color={ASSET_CLASS_OPTIONS.find(opt => opt.id === allocation.id)?.color}
                    onRemove={() => setAllocations(prev => prev.filter(a => a.id !== allocation.id))}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Summary */}
        <div className="space-y-6">
           <div className="rounded-2xl bg-slate-900/40 border border-slate-800 p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-600/10 transition-colors" />
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-6">Spreiding</h3>
            <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPie>
                    <Pie 
                      data={allocations.filter(a => a.percent > 0).map(a => ({ name: a.id, value: a.percent, color: ASSET_CLASS_OPTIONS.find(o => o.id === a.id)?.color }))} 
                      cx="50%" cy="50%" innerRadius={55} outerRadius={75} dataKey="value" stroke="none" paddingAngle={5}
                    >
                      {allocations.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={ASSET_CLASS_OPTIONS.find(o => o.id === entry.id)?.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                  </RechartsPie>
                </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}