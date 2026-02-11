"use client";

import { motion } from "framer-motion";
import { Globe, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

// Inline formatter voor consistentie
const formatPercentage = (val: number) => `${val.toFixed(1)}%`;

const REGION_FLAGS: Record<string, string> = {
  "North America": "🌎",
  "Europe": "🇪🇺",
  "Asia Pacific": "🌏",
  "Emerging Markets": "🌐",
  "Other": "🏳️"
};

const COUNTRY_FLAGS: Record<string, string> = {
  "USA": "🇺🇸", "United States": "🇺🇸", "Germany": "🇩🇪",
  "UK": "🇬🇧", "France": "🇫🇷", "Japan": "🇯🇵",
  "Netherlands": "🇳🇱", "Switzerland": "🇨🇭", "China": "🇨🇳"
};

const REGION_COLORS: Record<string, string> = {
  "North America": "bg-blue-600",
  "Europe": "bg-emerald-500",
  "Asia Pacific": "bg-amber-500",
  "Emerging Markets": "bg-rose-500",
  "Other": "bg-slate-600"
};

interface GeographicBreakdownProps {
  assetClasses?: any[];
}

export default function GeographicBreakdown({ assetClasses = [] }: GeographicBreakdownProps) {
  // 1. Data Aggregatie (geoptimaliseerd voor de nieuwe engine structuur)
  const geoData: Record<string, { value: number; countries: Record<string, number> }> = {};
  let totalPortfolioValue = 0;

  assetClasses.forEach(ac => {
    const assets = ac.assets ?? [];
    assets.forEach((asset: any) => {
      const region = asset.region ?? "Other";
      const country = asset.country ?? "Unknown";
      const val = (asset.price * asset.amount) || 0;

      totalPortfolioValue += val;

      if (!geoData[region]) geoData[region] = { value: 0, countries: {} };
      geoData[region].value += val;

      if (!geoData[region].countries[country]) geoData[region].countries[country] = 0;
      geoData[region].countries[country] += val;
    });
  });

  const sortedRegions = Object.entries(geoData)
    .map(([region, data]) => ({
      region,
      percentage: totalPortfolioValue > 0 ? (data.value / totalPortfolioValue) * 100 : 0,
      countries: Object.entries(data.countries)
        .map(([name, v]) => ({
          name,
          percentage: totalPortfolioValue > 0 ? (v / totalPortfolioValue) * 100 : 0
        }))
        .sort((a, b) => b.percentage - a.percentage)
    }))
    .sort((a, b) => b.percentage - a.percentage);

  if (sortedRegions.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-3xl bg-black/20 border border-white/5 overflow-hidden backdrop-blur-xl shadow-2xl"
    >
      {/* Header */}
      <div className="p-8 border-b border-white/5 flex items-center gap-4 bg-white/[0.02]">
        <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20">
          <Globe className="w-5 h-5 text-blue-500" />
        </div>
        <div>
          <h3 className="text-sm font-black text-white italic uppercase tracking-widest">Global Footprint</h3>
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Geographic Capital Concentration</p>
        </div>
      </div>

      

      {/* Aggregate Bar */}
      <div className="px-8 py-5 bg-black/20 border-b border-white/5">
        <div className="h-1.5 rounded-full overflow-hidden flex bg-slate-900 shadow-inner">
          {sortedRegions.map((item) => (
            <motion.div
              key={item.region}
              initial={{ width: 0 }}
              animate={{ width: `${item.percentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={cn(
                "h-full border-r border-black/40 last:border-0",
                REGION_COLORS[item.region] ?? REGION_COLORS.Other
              )}
            />
          ))}
        </div>
      </div>

      {/* List View */}
      <div className="p-8 space-y-8">
        {sortedRegions.map((item) => (
          <div key={item.region} className="group">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-xl filter group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] transition-all">
                  {REGION_FLAGS[item.region] ?? "🌐"}
                </span>
                <span className="text-xs font-black text-white uppercase tracking-widest italic">{item.region}</span>
              </div>
              <span className="text-xs font-mono font-black text-blue-400">
                {formatPercentage(item.percentage)}
              </span>
            </div>

            {/* Sub-node View (Countries) */}
            <div className="ml-5 pl-6 border-l border-white/10 space-y-3">
              {item.countries.slice(0, 3).map((country) => (
                <div key={country.name} className="flex justify-between items-center group/item">
                  <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500 uppercase tracking-tighter group-hover/item:text-slate-300 transition-colors">
                    <MapPin className="w-2.5 h-2.5 opacity-30 group-hover/item:opacity-100 transition-opacity" />
                    <span>{COUNTRY_FLAGS[country.name] ?? "🏳️"}</span>
                    <span>{country.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-0.5 bg-white/5 rounded-full overflow-hidden">
                       <div 
                         className="h-full bg-slate-700" 
                         style={{ width: `${(country.percentage / item.percentage) * 100}%` }}
                       />
                    </div>
                    <span className="text-[10px] font-mono text-slate-600 font-bold min-w-[35px] text-right">
                      {formatPercentage(country.percentage)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Node */}
      <div className="px-8 py-4 bg-white/[0.01] border-t border-white/5 flex justify-center">
        <span className="text-[9px] font-mono text-slate-600 uppercase tracking-[0.2em] italic">
          Data synchronized with clearing house regional nodes
        </span>
      </div>
    </motion.div>
  );
}