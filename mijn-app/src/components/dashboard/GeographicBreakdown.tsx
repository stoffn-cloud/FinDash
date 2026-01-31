import { motion } from "framer-motion";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPercentage } from "@/lib/formatters";

// Flags en kleuren voor regio's en landen
const REGION_FLAGS: Record<string, string> = {
  "Global": "🌍",
  "North America": "🌎",
  "Europe": "🇪🇺",
  "Asia Pacific": "🌏",
  "Emerging Markets": "🌐",
  "Other": "🏳️"
};

const COUNTRY_FLAGS: Record<string, string> = {
  "USA": "🇺🇸",
  "United States": "🇺🇸",
  "Germany": "🇩🇪",
  "UK": "🇬🇧",
  "France": "🇫🇷",
  "Japan": "🇯🇵",
  "Netherlands": "🇳🇱",
  "Switzerland": "🇨🇭",
  "China": "🇨🇳"
};

// Kleuren per regio
const REGION_COLORS: Record<string, string> = {
  "Global": "bg-blue-400",
  "North America": "bg-blue-600",
  "Europe": "bg-emerald-500",
  "Asia Pacific": "bg-amber-500",
  "Emerging Markets": "bg-rose-500",
  "Other": "bg-slate-500"
};

// Typedefs voor props
interface Holding {
  region?: string;
  country?: string;
  value?: number;
}

interface AssetClass {
  name?: string;
  holdings?: Holding[];
}

interface GeographicBreakdownProps {
  assetClasses?: AssetClass[];
}

export default function GeographicBreakdown({ assetClasses = [] }: GeographicBreakdownProps) {
  // 1. Data Aggregatie
  const geoData: Record<string, { value: number; countries: Record<string, number> }> = {};
  let totalPortfolioValue = 0;

  assetClasses.forEach(ac => {
    const holdings = ac.holdings ?? [];
    holdings.forEach(holding => {
      const region = holding.region ?? "Other";
      const country = holding.country ?? "Unknown";
      const val = holding.value ?? 0;

      totalPortfolioValue += val;

      if (!geoData[region]) geoData[region] = { value: 0, countries: {} };
      geoData[region].value += val;

      if (!geoData[region].countries[country]) geoData[region].countries[country] = 0;
      geoData[region].countries[country] += val;
    });
  });

  // 2. Sorteren en formatteren
  const sortedRegions = Object.entries(geoData)
    .map(([region, data]) => ({
      region,
      value: data.value,
      percentage: totalPortfolioValue > 0 ? (data.value / totalPortfolioValue) * 100 : 0,
      countries: Object.entries(data.countries)
        .map(([name, v]) => ({
          name,
          percentage: totalPortfolioValue > 0 ? (v / totalPortfolioValue) * 100 : 0
        }))
        .sort((a, b) => b.percentage - a.percentage)
    }))
    .sort((a, b) => b.value - a.value);

  if (sortedRegions.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-slate-900/50 border border-slate-700/50 overflow-hidden backdrop-blur-md"
    >
      {/* Header */}
      <div className="p-6 border-b border-slate-700/50 flex items-center gap-4">
        <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20">
          <Globe className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Geografische Spreiding</h3>
          <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Exposure per regio</p>
        </div>
      </div>

      {/* Region Bar */}
      <div className="px-6 py-4 bg-slate-800/20 border-b border-slate-700/30">
        <div className="h-2.5 rounded-full overflow-hidden flex bg-slate-800">
          {sortedRegions.map((item) => (
            <div
              key={item.region}
              style={{ width: `${item.percentage}%` }}
              className={cn(
                "h-full border-r border-slate-950/20 last:border-0",
                REGION_COLORS[item.region as keyof typeof REGION_COLORS] ?? REGION_COLORS.Other
              )}
            />
          ))}
        </div>
      </div>

      {/* Gedetailleerde lijst */}
      <div className="p-6 space-y-6">
        {sortedRegions.map((item) => (
          <div key={item.region} className="group">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-xl filter grayscale group-hover:grayscale-0 transition-all">
                  {REGION_FLAGS[item.region as keyof typeof REGION_FLAGS] ?? "🌐"}
                </span>
                <span className="font-bold text-slate-200">{item.region}</span>
              </div>
              <span className="text-sm font-mono text-blue-400 font-bold">
                {formatPercentage(item.percentage, false, 1)}
              </span>
            </div>

            {/* Deel-landen */}
            <div className="ml-9 pl-4 border-l-2 border-slate-800 space-y-2">
              {item.countries.slice(0, 3).map((country) => (
                <div key={country.name} className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2 text-slate-400">
                    <span>{COUNTRY_FLAGS[country.name] ?? "🏳️"}</span>
                    <span>{country.name}</span>
                  </div>
                  <span className="text-slate-500 font-medium">{formatPercentage(country.percentage, false, 1)}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
