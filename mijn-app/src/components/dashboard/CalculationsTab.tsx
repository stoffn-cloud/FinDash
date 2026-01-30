import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calculator, TrendingUp, Info } from "lucide-react";
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

// Eventuele helper functie voor className combinaties
const cn = (...classes: (string | false | null | undefined)[]) =>
  classes.filter(Boolean).join(" ");

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
      [field]:
        typeof prev[field] === "number" ? Number(value) : value,
    }));
    setYtmResult(null); // Reset resultaat bij nieuwe invoer
  };

  const calculateYTM = () => {
    const { faceValue, currentPrice, couponRate, yearsToMaturity, paymentFrequency } = bondInputs;
    const F = Number(faceValue);
    const P = Number(currentPrice);
    const C = (Number(couponRate) / 100) * F / paymentFrequency;
    const n = Number(yearsToMaturity) * paymentFrequency;

    if (P <= 0 || n <= 0) return; // Voorkom ongeldige invoer

    // Newton-Raphson methode om YTM te benaderen
    let ytm = couponRate / 100;
    const tolerance = 1e-7;
    const maxIterations = 100;

    for (let i = 0; i < maxIterations; i++) {
      const r = ytm / paymentFrequency;
      if (r <= -1) break; // Voorkom negatieve rente crash

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
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
          <Calculator className="w-5 h-5 text-amber-500" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Financiële Rekentools</h2>
          <p className="text-sm text-slate-400">Bereken rendementen en obligatie-metrics</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calculator Sectie */}
        <div className="rounded-2xl bg-slate-900/50 border border-slate-700/50 p-6 backdrop-blur-md">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            <h3 className="text-lg font-semibold text-white">Yield to Maturity (YTM)</h3>
          </div>

          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300 text-xs uppercase tracking-wider">Nominale Waarde</Label>
                <Input
                  type="number"
                  value={bondInputs.faceValue}
                  onChange={(e) => updateInput("faceValue", e.target.value)}
                  className="bg-slate-800/50 border-slate-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300 text-xs uppercase tracking-wider">Huidige Prijs</Label>
                <Input
                  type="number"
                  value={bondInputs.currentPrice}
                  onChange={(e) => updateInput("currentPrice", e.target.value)}
                  className="bg-slate-800/50 border-slate-700 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300 text-xs uppercase tracking-wider">Coupon Rente (%)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={bondInputs.couponRate}
                  onChange={(e) => updateInput("couponRate", e.target.value)}
                  className="bg-slate-800/50 border-slate-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300 text-xs uppercase tracking-wider">Looptijd (Jaren)</Label>
                <Input
                  type="number"
                  value={bondInputs.yearsToMaturity}
                  onChange={(e) => updateInput("yearsToMaturity", e.target.value)}
                  className="bg-slate-800/50 border-slate-700 text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300 text-xs uppercase tracking-wider">Betaalfrequentie</Label>
              <Select
                value={bondInputs.paymentFrequency.toString()}
                onValueChange={(v) => updateInput("paymentFrequency", Number(v))}
              >
                <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700 text-white">
                  <SelectItem value="1">Jaarlijks</SelectItem>
                  <SelectItem value="2">Halfjaarlijks</SelectItem>
                  <SelectItem value="4">Kwartaal</SelectItem>
                  <SelectItem value="12">Maandelijks</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={calculateYTM}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-all"
            >
              Bereken Rendement
            </Button>
          </div>
        </div>

        {/* Resultaten Sectie */}
        <div className="rounded-2xl bg-slate-900/50 border border-slate-700/50 p-6 backdrop-blur-md relative overflow-hidden">
          <h3 className="text-lg font-semibold text-white mb-6">Analyse Resultaten</h3>

          {ytmResult ? (
            <div className="space-y-4">
              <div className="bg-emerald-500/10 rounded-xl p-5 border border-emerald-500/20">
                <p className="text-xs text-emerald-500 uppercase font-bold tracking-widest mb-1">Yield to Maturity</p>
                <p className="text-4xl font-black text-emerald-400">{ytmResult.ytm.toFixed(3)}%</p>
                <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                  <Info className="w-3 h-3" /> Effectief jaarrendement bij vasthouden tot einddatum.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
                  <p className="text-slate-400 text-xs mb-1">Current Yield</p>
                  <p className="text-xl font-bold text-white">{ytmResult.currentYield.toFixed(2)}%</p>
                </div>
                <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
                  <p className="text-slate-400 text-xs mb-1">Koerswinst/Verlies</p>
                  <p className={`text-xl font-bold ${ytmResult.capitalGainLoss >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                    ${ytmResult.capitalGainLoss.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="pt-4 flex justify-between items-center border-t border-slate-700/50">
                <span className="text-slate-400 text-sm">Status:</span>
                <Badge
                  className={cn(
                    "px-3 py-1",
                    bondInputs.currentPrice < bondInputs.faceValue
                      ? "bg-emerald-500/20 text-emerald-400"
                      : bondInputs.currentPrice > bondInputs.faceValue
                      ? "bg-amber-500/20 text-amber-400"
                      : "bg-slate-700 text-slate-300"
                  )}
                >
                  {bondInputs.currentPrice < bondInputs.faceValue
                    ? "Onder Nominale Waarde (Discount)"
                    : bondInputs.currentPrice > bondInputs.faceValue
                    ? "Boven Nominale Waarde (Premium)"
                    : "A pari"}
                </Badge>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-slate-500 border-2 border-dashed border-slate-800 rounded-xl">
              <Calculator className="w-8 h-8 mb-2 opacity-20" />
              <p className="text-sm">Vul de gegevens in voor analyse</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
