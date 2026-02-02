"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calculator, TrendingUp, Info, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type BondInputs = {
  faceValue: number;
  currentPrice: number;
  couponRate: number;
  yearsToMaturity: number;
  paymentFrequency: number;
};

type YTMResult = {
  ytm: number;
  totalCoupons: number;
  capitalGainLoss: number;
  totalReturn: number;
  currentYield: number;
};

export default function CalculationsTab() {
  const [bondInputs, setBondInputs] = useState<BondInputs>({
    faceValue: 1000,
    currentPrice: 950,
    couponRate: 5,
    yearsToMaturity: 10,
    paymentFrequency: 2,
  });

  const [ytmResult, setYtmResult] = useState<YTMResult | null>(null);

  const updateInput = (field: keyof BondInputs, value: string | number) => {
    setBondInputs((prev) => ({
      ...prev,
      [field]: typeof prev[field] === "number" ? Number(value) : value,
    }));
    setYtmResult(null);
  };

  const calculateYTM = () => {
    const { faceValue, currentPrice, couponRate, yearsToMaturity, paymentFrequency } = bondInputs;
    const F = Number(faceValue);
    const P = Number(currentPrice);
    const C = (Number(couponRate) / 100) * F / paymentFrequency;
    const n = Number(yearsToMaturity) * paymentFrequency;

    if (P <= 0 || n <= 0) return;

    // Newton-Raphson approximation
    let ytm = couponRate / 100;
    const tolerance = 1e-7;
    const maxIterations = 100;

    for (let i = 0; i < maxIterations; i++) {
      const r = ytm / paymentFrequency;
      if (r <= -1) break;

      let priceCalc = 0;
      for (let t = 1; t <= n; t++) {
        priceCalc += C / Math.pow(1 + r, t);
      }
      priceCalc += F / Math.pow(1 + r, n);

      let derivative = 0;
      for (let t = 1; t <= n; t++) {
        derivative -= (t * C) / Math.pow(1 + r, t + 1);
      }
      derivative -= (n * F) / Math.pow(1 + r, n + 1);
      derivative /= paymentFrequency;

      const diff = priceCalc - P;
      if (Math.abs(diff) < tolerance) break;
      if (derivative === 0) break;

      ytm = ytm - diff / derivative;
    }

    setYtmResult({
      ytm: ytm * 100,
      totalCoupons: C * n,
      capitalGainLoss: F - P,
      totalReturn: C * n + (F - P),
      currentYield: ((couponRate / 100) * F / P) * 100,
    });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
          <Calculator className="w-6 h-6 text-amber-500" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Fixed Income Terminal</h2>
          <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">Bond Analytics & Yield Projections</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Card */}
        <div className="rounded-3xl bg-black/20 border border-white/5 p-8 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center gap-3 mb-8">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-black text-white uppercase tracking-widest">Bond Parameters</h3>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Face Value (F)</Label>
                <Input
                  type="number"
                  value={bondInputs.faceValue}
                  onChange={(e) => updateInput("faceValue", e.target.value)}
                  className="bg-slate-900/50 border-white/5 text-white font-mono focus:border-blue-500/50 transition-all rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Market Price (P)</Label>
                <Input
                  type="number"
                  value={bondInputs.currentPrice}
                  onChange={(e) => updateInput("currentPrice", e.target.value)}
                  className="bg-slate-900/50 border-white/5 text-white font-mono focus:border-blue-500/50 transition-all rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Coupon Rate (%)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={bondInputs.couponRate}
                  onChange={(e) => updateInput("couponRate", e.target.value)}
                  className="bg-slate-900/50 border-white/5 text-white font-mono focus:border-blue-500/50 transition-all rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Maturity (Years)</Label>
                <Input
                  type="number"
                  value={bondInputs.yearsToMaturity}
                  onChange={(e) => updateInput("yearsToMaturity", e.target.value)}
                  className="bg-slate-900/50 border-white/5 text-white font-mono focus:border-blue-500/50 transition-all rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Frequency</Label>
              <Select
                value={bondInputs.paymentFrequency.toString()}
                onValueChange={(v) => updateInput("paymentFrequency", Number(v))}
              >
                <SelectTrigger className="bg-slate-900/50 border-white/5 text-white font-mono rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-white/10 text-white font-mono">
                  <SelectItem value="1">Annual</SelectItem>
                  <SelectItem value="2">Semi-Annual</SelectItem>
                  <SelectItem value="4">Quarterly</SelectItem>
                  <SelectItem value="12">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={calculateYTM}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest py-6 rounded-xl shadow-lg shadow-blue-600/20 transition-all group"
            >
              Run Calculation <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>

        {/* Output Card */}
        <div className="rounded-3xl bg-black/20 border border-white/5 p-8 backdrop-blur-xl relative overflow-hidden flex flex-col justify-center">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-8">Analysis Output</h3>

          {ytmResult ? (
            <div className="space-y-8">
              <div className="bg-blue-500/5 rounded-2xl p-6 border border-blue-500/10">
                <p className="text-[10px] text-blue-400 uppercase font-black tracking-widest mb-2">Yield to Maturity</p>
                <p className="text-5xl font-black text-white font-mono italic">{ytmResult.ytm.toFixed(3)}%</p>
                <div className="mt-4 flex items-center gap-2 text-[10px] text-slate-500 uppercase font-bold">
                  <Info className="w-3 h-3 text-blue-500" />
                  Annualized effective return
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/[0.02] p-5 rounded-2xl border border-white/5">
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">Current Yield</p>
                  <p className="text-xl font-black text-white font-mono">{ytmResult.currentYield.toFixed(2)}%</p>
                </div>
                <div className="bg-white/[0.02] p-5 rounded-2xl border border-white/5">
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">Gain/Loss</p>
                  <p className={cn("text-xl font-black font-mono", ytmResult.capitalGainLoss >= 0 ? "text-emerald-400" : "text-rose-400")}>
                    ${ytmResult.capitalGainLoss.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t border-white/5 flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Pricing Status</span>
                <Badge
                  className={cn(
                    "px-4 py-1.5 rounded-lg font-black uppercase text-[10px] tracking-widest border-none",
                    bondInputs.currentPrice < bondInputs.faceValue
                      ? "bg-emerald-500/10 text-emerald-400"
                      : bondInputs.currentPrice > bondInputs.faceValue
                      ? "bg-amber-500/10 text-amber-400"
                      : "bg-slate-800 text-slate-400"
                  )}
                >
                  {bondInputs.currentPrice < bondInputs.faceValue
                    ? "DISCOUNT"
                    : bondInputs.currentPrice > bondInputs.faceValue
                    ? "PREMIUM"
                    : "AT PAR"}
                </Badge>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-slate-600 border border-dashed border-white/5 rounded-3xl">
              <Calculator className="w-12 h-12 mb-4 opacity-10" />
              <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Input Parameters to Initialize</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}