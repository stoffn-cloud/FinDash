"use client";

import { 
  TrendingDown,
  Info,
  Globe,
  Zap
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { cn } from "@/lib/utils";

interface YieldData {
  period: string;
  yield: number;
}

const yieldCurveData: YieldData[] = [
  { period: "1M", yield: 5.38 },
  { period: "3M", yield: 5.42 },
  { period: "6M", yield: 5.35 },
  { period: "1Y", yield: 5.02 },
  { period: "2Y", yield: 4.65 },
  { period: "5Y", yield: 4.28 },
  { period: "10Y", yield: 4.22 },
  { period: "20Y", yield: 4.45 },
  { period: "30Y", yield: 4.38 },
];

const CustomYieldTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-700 p-2 rounded shadow-lg">
        <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-1">Treasury Yield</p>
        <p className="text-white font-mono">{payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

export default function MarketsTab() {
  return (
    <div className="space-y-6">
      {/* 1. TOP METRICS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {[
          { label: "Fed Funds Rate", value: "5.50%", change: "Unchanged", status: "Neutral", icon: Zap },
          { label: "ECB Rate", value: "4.50%", change: "-25bps", status: "Bullish", icon: Globe },
          { label: "US CPI (YoY)", value: "3.20%", change: "-0.1%", status: "Bullish", icon: TrendingDown },
          { label: "Fear & Greed", value: "64", change: "+2", status: "Greed", icon: Activity }
        ].map((item, i) => (
          <Card key={i} className="bg-slate-900/40 border-slate-800">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <item.icon className="w-4 h-4 text-blue-400" />
                <Badge variant="outline" className="text-[10px] py-0">{item.status}</Badge>
              </div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">{item.label}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-white font-mono">{item.value}</span>
                <span className="text-[10px] text-slate-400">{item.change}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 2. MAIN YIELD CURVE (Nu over de volledige breedte) */}
      <Card className="bg-slate-900/40 border-slate-800">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-white text-base flex items-center gap-2">
              US Treasury Yield Curve
              <Info className="w-3 h-3 text-slate-500" />
            </CardTitle>
            <CardDescription className="text-slate-500 text-xs">Current Market Yields vs 1 Month Ago</CardDescription>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
            <span className="text-[10px] text-slate-400 font-mono">Live Node Data</span>
          </div>
        </CardHeader>
        <CardContent className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={yieldCurveData}>
              <defs>
                <linearGradient id="colorYield" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
              <XAxis
                dataKey="period"
                stroke="#475569"
                fontSize={10}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                stroke="#475569"
                fontSize={10}
                axisLine={false}
                tickLine={false}
                domain={[3.5, 6]}
              />
              <Tooltip content={<CustomYieldTooltip />} />
              <Area
                type="monotone"
                dataKey="yield"
                stroke="#3b82f6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorYield)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

const Activity = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);