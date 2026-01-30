import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Castle, Plus, AlertCircle, Save, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

// Helper components die we binnen Sandbox gebruiken
import AllocationSlider from "./AllocationSlider"; // Zorg dat deze goed ge-export is
import SecuritySelector from "./SecuritySelector";

export default function SandboxTab({ portfolio }) {
  const [totalInvestment, setTotalInvestment] = useState(portfolio?.totalValue || 1000000);
  const [currency, setCurrency] = useState("USD");
  const [allocations, setAllocations] = useState([
    { id: "equities", percent: 60, securities: [] },
    { id: "fixed_income", percent: 30, securities: [] },
    { id: "cash", percent: 10, securities: [] },
  ]);
  const [expandedClass, setExpandedClass] = useState(null);

  // Gebruik useMemo voor zware berekeningen zodat de sliders soepel blijven
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

  // Handlers
  const updateAllocation = (id, percent) => {
    setAllocations(prev => prev.map(a => a.id === id ? { ...a, percent } : a));
  };

  const addAssetClass = (assetClass) => {
    if (!allocations.find(a => a.id === assetClass.id)) {
      setAllocations([...allocations, { id: assetClass.id, percent: 0, securities: [] }]);
    }
  };

  const getAssetClassInfo = (id) => ASSET_CLASS_OPTIONS.find(ac => ac.id === id);

  const pieData = useMemo(() => 
    allocations
      .filter(a => a.percent > 0)
      .map(a => ({
        name: getAssetClassInfo(a.id)?.name,
        value: a.percent,
        color: getAssetClassInfo(a.id)?.color,
      })), [allocations]);

  return (
    <div className="space-y-6 pb-10">
      {/* Header met Save Actie */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-violet-500/10 border border-violet-500/20">
            <Castle className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Portfolio Sandbox</h2>
            <p className="text-sm text-slate-400">Simuleer scenario's en bereken de impact op je risico</p>
          </div>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all">
          <Save className="w-4 h-4 mr-2" /> Scenario Opslaan
        </Button>
      </div>

      {/* 4-Col Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 shadow-sm">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Investering</p>
          <div className="flex gap-2">
            <Input
              type="number"
              value={totalInvestment}
              onChange={(e) => setTotalInvestment(Number(e.target.value))}
              className="text-lg font-mono font-bold bg-slate-800/50 border-slate-700 text-white"
            />
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger className="w-20 bg-slate-800/50 border-slate-700 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <MetricCard label="Verwacht Rendement" value={`${metrics.return.toFixed(2)}%`} sub="Historisch gem." color="text-emerald-400" />
        <MetricCard label="Portfolio Beta" value={metrics.beta.toFixed(2)} sub="Marktgevoeligheid" color="text-blue-400" />
        <MetricCard label="Volatiliteit" value={`${metrics.vol.toFixed(2)}%`} sub="Jaarlijkse σ" color="text-amber-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Allocation Builder */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl bg-slate-900/40 border border-slate-800 p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-sm font-bold text-white uppercase tracking-widest">Samenstelling</h3>
              <Badge className={cn(
                "px-3 py-1 font-mono",
                totalAllocation === 100 ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border-rose-500/20"
              )}>
                {totalAllocation}% Totaal
              </Badge>
            </div>

            <div className="space-y-6">
              <AnimatePresence>
                {allocations.map((allocation) => (
                  <motion.div 
                    key={allocation.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <div 
                      onClick={() => setExpandedClass(expandedClass === allocation.id ? null : allocation.id)}
                      className="group cursor-pointer"
                    >
                      <AllocationSlider
                        label={getAssetClassInfo(allocation.id)?.name}
                        value={allocation.percent}
                        onChange={(v) => updateAllocation(allocation.id, v)}
                        color={getAssetClassInfo(allocation.id)?.color}
                        onRemove={() => setAllocations(prev => prev.filter(a => a.id !== allocation.id))}
                      />
                    </div>
                    
                    {expandedClass === allocation.id && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        className="overflow-hidden"
                      >
                        <SecuritySelector
                          assetClassId={allocation.id}
                          securities={allocation.securities}
                          onSecuritiesChange={(s) => setAllocations(prev => prev.map(a => a.id === allocation.id ? { ...a, securities: s } : a))}
                        />
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Add Class Footer */}
            <div className="mt-8 pt-6 border-t border-slate-800/60">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Categorie Toevoegen</p>
              <div className="flex flex-wrap gap-2">
                {ASSET_CLASS_OPTIONS.filter(opt => !allocations.find(a => a.id === opt.id)).map(opt => (
                  <Button 
                    key={opt.id} 
                    variant="outline" 
                    size="sm" 
                    onClick={() => addAssetClass(opt)}
                    className="text-[10px] uppercase font-bold border-slate-700 hover:bg-slate-800 transition-colors"
                  >
                    <Plus className="w-3 h-3 mr-1" /> {opt.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Pie & Summary */}
        <div className="space-y-6">
          <div className="rounded-2xl bg-slate-900/40 border border-slate-800 p-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6">Visuele Verdeling</h3>
            <div className="h-48 relative">
              {totalAllocation > 100 && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-950/60 backdrop-blur-[2px] rounded-full">
                  <div className="text-center p-2">
                    <AlertCircle className="w-6 h-6 text-rose-500 mx-auto mb-1" />
                    <p className="text-[10px] text-rose-200 font-bold uppercase">Over-allocated</p>
                  </div>
                </div>
              )}
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPie>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" stroke="none" paddingAngle={4}>
                    {pieData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                </RechartsPie>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-6 space-y-3">
              {allocations.filter(a => a.percent > 0).map(a => (
                <div key={a.id} className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: getAssetClassInfo(a.id)?.color }} />
                    <span className="text-slate-400">{getAssetClassInfo(a.id)?.name}</span>
                  </div>
                  <span className="font-mono font-bold text-white">{a.percent}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-blue-500/5 border border-blue-500/10 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-4 h-4 text-blue-400" />
              <h4 className="text-xs font-bold text-blue-300 uppercase">Sandbox Info</h4>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Deze berekeningen zijn gebaseerd op historische gemiddelden van de afgelopen 15 jaar. Resultaten in de toekomst kunnen afwijken.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-component voor de kleine metric kaarten
function MetricCard({ label, value, sub, color }) {
  return (
    <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 shadow-sm">
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{label}</p>
      <p className={cn("text-2xl font-mono font-bold", color)}>{value}</p>
      <p className="text-[10px] text-slate-600 font-medium">{sub}</p>
    </div>
  );
}

// Custom Tooltip voor de Pie Chart
const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-700 p-2 rounded-lg shadow-xl text-xs">
        <p className="font-bold text-white">{payload[0].name}</p>
        <p className="text-slate-400">{payload[0].value}% van totaal</p>
      </div>
    );
  }
  return null;
};