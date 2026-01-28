import { useState } from "react";
import { motion } from "framer-motion";
import { Calculator, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export default function CalculationsTab() {
  const [bondInputs, setBondInputs] = useState({
    faceValue: 1000,
    currentPrice: 950,
    couponRate: 5,
    yearsToMaturity: 10,
    paymentFrequency: 2, // semi-annual
  });
  const [ytmResult, setYtmResult] = useState(null);

  const calculateYTM = () => {
    const { faceValue, currentPrice, couponRate, yearsToMaturity, paymentFrequency } = bondInputs;
    const F = parseFloat(faceValue);
    const P = parseFloat(currentPrice);
    const C = (parseFloat(couponRate) / 100) * F / paymentFrequency;
    const n = parseFloat(yearsToMaturity) * paymentFrequency;

    // Newton-Raphson method to solve for YTM
    let ytm = couponRate / 100; // Initial guess
    const tolerance = 0.0000001;
    const maxIterations = 100;

    for (let i = 0; i < maxIterations; i++) {
      const r = ytm / paymentFrequency;
      
      // Calculate bond price given current YTM guess
      let priceCalc = 0;
      for (let t = 1; t <= n; t++) {
        priceCalc += C / Math.pow(1 + r, t);
      }
      priceCalc += F / Math.pow(1 + r, n);

      // Calculate derivative
      let derivative = 0;
      for (let t = 1; t <= n; t++) {
        derivative -= (t * C) / Math.pow(1 + r, t + 1);
      }
      derivative -= (n * F) / Math.pow(1 + r, n + 1);
      derivative /= paymentFrequency;

      const diff = priceCalc - P;
      if (Math.abs(diff) < tolerance) break;

      ytm = ytm - diff / derivative;
    }

    const annualYTM = ytm * 100;
    const totalCoupons = C * n;
    const capitalGainLoss = F - P;
    const totalReturn = totalCoupons + capitalGainLoss;

    setYtmResult({
      ytm: annualYTM,
      totalCoupons,
      capitalGainLoss,
      totalReturn,
      currentYield: ((couponRate / 100) * F / P) * 100,
    });
  };

  const updateInput = (field, value) => {
    setBondInputs(prev => ({ ...prev, [field]: value }));
    setYtmResult(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-slate-800 border border-slate-700">
          <Calculator className="w-5 h-5 text-amber-400" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white">Financial Calculations</h2>
          <p className="text-sm text-slate-400">Bond yield and investment calculators</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bond YTM Calculator */}
        <div className="rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/50 border border-slate-700/50 backdrop-blur-xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-semibold text-white">Bond Yield to Maturity</h3>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-slate-400 text-sm">Face Value</Label>
                <Input
                  type="number"
                  value={bondInputs.faceValue}
                  onChange={(e) => updateInput("faceValue", e.target.value)}
                  className="bg-slate-800 border-slate-600 text-white mt-1"
                  placeholder="1000"
                />
              </div>
              <div>
                <Label className="text-slate-400 text-sm">Current Price</Label>
                <Input
                  type="number"
                  value={bondInputs.currentPrice}
                  onChange={(e) => updateInput("currentPrice", e.target.value)}
                  className="bg-slate-800 border-slate-600 text-white mt-1"
                  placeholder="950"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-slate-400 text-sm">Coupon Rate (%)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={bondInputs.couponRate}
                  onChange={(e) => updateInput("couponRate", e.target.value)}
                  className="bg-slate-800 border-slate-600 text-white mt-1"
                  placeholder="5"
                />
              </div>
              <div>
                <Label className="text-slate-400 text-sm">Years to Maturity</Label>
                <Input
                  type="number"
                  step="0.5"
                  value={bondInputs.yearsToMaturity}
                  onChange={(e) => updateInput("yearsToMaturity", e.target.value)}
                  className="bg-slate-800 border-slate-600 text-white mt-1"
                  placeholder="10"
                />
              </div>
            </div>

            <div>
              <Label className="text-slate-400 text-sm">Payment Frequency</Label>
              <Select 
                value={bondInputs.paymentFrequency.toString()} 
                onValueChange={(v) => updateInput("paymentFrequency", parseInt(v))}
              >
                <SelectTrigger className="bg-slate-800 border-slate-600 text-white mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Annual</SelectItem>
                  <SelectItem value="2">Semi-Annual</SelectItem>
                  <SelectItem value="4">Quarterly</SelectItem>
                  <SelectItem value="12">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={calculateYTM}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Calculate YTM
            </Button>
          </div>
        </div>

        {/* Results */}
        <div className="rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/50 border border-slate-700/50 backdrop-blur-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Results</h3>

          {ytmResult ? (
            <div className="space-y-4">
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                <p className="text-sm text-slate-400 mb-1">Yield to Maturity (YTM)</p>
                <p className="text-3xl font-bold text-emerald-400">{ytmResult.ytm.toFixed(3)}%</p>
                <p className="text-xs text-slate-500 mt-1">Annualized return if held to maturity</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                  <p className="text-sm text-slate-400 mb-1">Current Yield</p>
                  <p className="text-xl font-bold text-white">{ytmResult.currentYield.toFixed(2)}%</p>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                  <p className="text-sm text-slate-400 mb-1">Capital Gain/Loss</p>
                  <p className={`text-xl font-bold ${ytmResult.capitalGainLoss >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    ${ytmResult.capitalGainLoss.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                  <p className="text-sm text-slate-400 mb-1">Total Coupons</p>
                  <p className="text-xl font-bold text-white">${ytmResult.totalCoupons.toFixed(2)}</p>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                  <p className="text-sm text-slate-400 mb-1">Total Return</p>
                  <p className="text-xl font-bold text-emerald-400">${ytmResult.totalReturn.toFixed(2)}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-700/50">
                <Badge className="bg-slate-700/50 text-slate-300">
                  {bondInputs.currentPrice < bondInputs.faceValue ? "Trading at Discount" : 
                   bondInputs.currentPrice > bondInputs.faceValue ? "Trading at Premium" : "Trading at Par"}
                </Badge>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-slate-500">
              <p>Enter bond details and click Calculate</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}