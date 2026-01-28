import { motion } from "framer-motion";
import { Grid3X3 } from "lucide-react";
import CorrelationMatrix from "@/components/dashboard/CorrelationMatrix";

// Sample historical correlations between asset classes
const ASSET_CLASS_CORRELATIONS = {
  "Equities-Fixed Income": -0.15,
  "Equities-Alternatives": 0.45,
  "Equities-Real Estate": 0.62,
  "Equities-Commodities": 0.35,
  "Equities-Cash": 0.05,
  "Fixed Income-Alternatives": 0.12,
  "Fixed Income-Real Estate": 0.25,
  "Fixed Income-Commodities": -0.08,
  "Fixed Income-Cash": 0.55,
  "Alternatives-Real Estate": 0.38,
  "Alternatives-Commodities": 0.52,
  "Alternatives-Cash": 0.02,
  "Real Estate-Commodities": 0.28,
  "Real Estate-Cash": 0.10,
  "Commodities-Cash": -0.05,
};

// Sample correlations between equity sectors
const SECTOR_CORRELATIONS = {
  "Technology-Healthcare": 0.55,
  "Technology-Financials": 0.62,
  "Technology-Consumer": 0.71,
  "Technology-Energy": 0.35,
  "Technology-Industrials": 0.58,
  "Technology-Utilities": 0.25,
  "Technology-Materials": 0.42,
  "Healthcare-Financials": 0.48,
  "Healthcare-Consumer": 0.52,
  "Healthcare-Energy": 0.28,
  "Healthcare-Industrials": 0.45,
  "Healthcare-Utilities": 0.35,
  "Healthcare-Materials": 0.38,
  "Financials-Consumer": 0.68,
  "Financials-Energy": 0.55,
  "Financials-Industrials": 0.72,
  "Financials-Utilities": 0.42,
  "Financials-Materials": 0.58,
  "Consumer-Energy": 0.45,
  "Consumer-Industrials": 0.65,
  "Consumer-Utilities": 0.32,
  "Consumer-Materials": 0.48,
  "Energy-Industrials": 0.62,
  "Energy-Utilities": 0.55,
  "Energy-Materials": 0.72,
  "Industrials-Utilities": 0.48,
  "Industrials-Materials": 0.68,
  "Utilities-Materials": 0.42,
};

export default function CorrelationsTab({ assetClasses, portfolio }) {
  // Get asset class names from the data, or use defaults
  const assetClassNames = assetClasses?.length > 0
    ? assetClasses.map(ac => ac.name)
    : ["Equities", "Fixed Income", "Alternatives", "Real Estate", "Commodities", "Cash"];

  // Get sector names from portfolio, or use defaults
  const sectorNames = portfolio?.sectors?.length > 0
    ? portfolio.sectors.map(s => s.name)
    : ["Technology", "Healthcare", "Financials", "Consumer", "Energy", "Industrials", "Utilities", "Materials"];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div className="p-2 rounded-lg bg-slate-800 border border-slate-700">
          <Grid3X3 className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white">Correlation Analysis</h2>
          <p className="text-sm text-slate-400">Historical correlations based on 5-year rolling data</p>
        </div>
      </motion.div>

      {/* Asset Class Correlation Matrix */}
      <CorrelationMatrix
        title="Asset Class Correlations"
        subtitle="Cross-asset correlation coefficients"
        items={assetClassNames}
        correlations={ASSET_CLASS_CORRELATIONS}
      />

      {/* Sector Correlation Matrix */}
      <CorrelationMatrix
        title="Equity Sector Correlations"
        subtitle="Intra-equity sector correlation coefficients"
        items={sectorNames}
        correlations={SECTOR_CORRELATIONS}
      />
    </div>
  );
}