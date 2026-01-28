import { motion } from "framer-motion";
import { Globe, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

const REGION_FLAGS = {
  "Global": "🌍",
  "Worldwide": "🌍",
  "North America": "🌎",
  "Europe": "🇪🇺",
  "Asia Pacific": "🌏",
  "Emerging Markets": "🌐",
  "Latin America": "🌎",
  "Middle East": "🌍",
};

const COUNTRY_FLAGS = {
  "USA": "🇺🇸",
  "United States": "🇺🇸",
  "Germany": "🇩🇪",
  "UK": "🇬🇧",
  "United Kingdom": "🇬🇧",
  "France": "🇫🇷",
  "Japan": "🇯🇵",
  "China": "🇨🇳",
  "Switzerland": "🇨🇭",
  "Canada": "🇨🇦",
  "Australia": "🇦🇺",
  "South Korea": "🇰🇷",
  "Taiwan": "🇹🇼",
  "India": "🇮🇳",
  "Brazil": "🇧🇷",
  "Netherlands": "🇳🇱",
  "Ireland": "🇮🇪",
};

const REGION_COLORS = {
  "Global": "bg-violet-500",
  "Worldwide": "bg-violet-500",
  "North America": "bg-blue-500",
  "Europe": "bg-emerald-500",
  "Asia Pacific": "bg-amber-500",
  "Emerging Markets": "bg-rose-500",
  "Latin America": "bg-orange-500",
  "Middle East": "bg-cyan-500",
};

export default function GeographicBreakdown({ assetClasses }) {
  // Extract geographic data from holdings
  const geoData = {};
  let totalValue = 0;

  assetClasses?.forEach(ac => {
    // Holdings can be at ac.holdings or ac.data?.holdings depending on data structure
    const holdings = ac.holdings || ac.data?.holdings || [];
    holdings.forEach(holding => {
      const region = holding.region || "Other";
      const country = holding.country || "";
      const value = holding.value || 0;
      totalValue += value;

      if (!geoData[region]) {
        geoData[region] = { value: 0, countries: {} };
      }
      geoData[region].value += value;

      if (country) {
        if (!geoData[region].countries[country]) {
          geoData[region].countries[country] = 0;
        }
        geoData[region].countries[country] += value;
      }
    });
  });

  // Sort regions - Global/Worldwide first, then by value
  const sortedRegions = Object.entries(geoData)
    .map(([region, data]) => ({
      region,
      value: data.value,
      percentage: totalValue > 0 ? (data.value / totalValue) * 100 : 0,
      countries: Object.entries(data.countries)
        .map(([country, val]) => ({
          country,
          value: val,
          percentage: totalValue > 0 ? (val / totalValue) * 100 : 0,
        }))
        .sort((a, b) => b.value - a.value),
    }))
    .sort((a, b) => {
      // Global/Worldwide always first
      if (a.region === "Global" || a.region === "Worldwide") return -1;
      if (b.region === "Global" || b.region === "Worldwide") return 1;
      return b.value - a.value;
    });

  if (sortedRegions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/50 border border-slate-700/50 backdrop-blur-xl p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-slate-800 border border-slate-700">
            <Globe className="w-5 h-5 text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">Geographic Exposure</h3>
        </div>
        <p className="text-slate-400">No geographic data available</p>
      </motion.div>
    );
  }

  const formatCurrency = (value) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value?.toFixed(0) || 0}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/50 border border-slate-700/50 backdrop-blur-xl overflow-hidden"
    >
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-slate-800 border border-slate-700">
            <Globe className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Geographic Exposure</h3>
            <p className="text-sm text-slate-400">Investment distribution by region & country</p>
          </div>
        </div>
      </div>

      {/* Region Bar */}
      <div className="px-6 py-4 border-b border-slate-700/50">
        <div className="h-3 rounded-full overflow-hidden flex bg-slate-800">
          {sortedRegions.map((item, index) => (
            <motion.div
              key={item.region}
              initial={{ width: 0 }}
              animate={{ width: `${item.percentage}%` }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className={cn(
                "h-full first:rounded-l-full last:rounded-r-full",
                REGION_COLORS[item.region] || "bg-slate-500"
              )}
            />
          ))}
        </div>
      </div>

      <div className="p-6 space-y-4">
        {sortedRegions.map((item) => (
          <div key={item.region} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl">{REGION_FLAGS[item.region] || "🌐"}</span>
                <div>
                  <p className="font-medium text-white">{item.region}</p>
                  <p className="text-xs text-slate-500">{formatCurrency(item.value)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percentage}%` }}
                    transition={{ duration: 0.8 }}
                    className={cn(
                      "h-full rounded-full",
                      REGION_COLORS[item.region] || "bg-slate-500"
                    )}
                  />
                </div>
                <span className="text-sm font-semibold text-white w-14 text-right">
                  {item.percentage.toFixed(1)}%
                </span>
              </div>
            </div>

            {/* Countries within region */}
            {item.countries.length > 0 && (
              <div className="ml-10 pl-4 border-l border-slate-700/50 space-y-1">
                {item.countries.slice(0, 4).map((country) => (
                  <div key={country.country} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span>{COUNTRY_FLAGS[country.country] || "🏳️"}</span>
                      <span className="text-slate-400">{country.country}</span>
                    </div>
                    <span className="text-slate-300">{country.percentage.toFixed(1)}%</span>
                  </div>
                ))}
                {item.countries.length > 4 && (
                  <p className="text-xs text-slate-500">+{item.countries.length - 4} more</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}