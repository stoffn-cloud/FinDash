import { motion } from "framer-motion";
import { Grid3X3, AlertCircle } from "lucide-react";
import CorrelationMatrix from "@/components/dashboard/CorrelationMatrix";

// Statische data voor correlaties (historische waarden)
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

export default function CorrelationsTab({ assetClasses = [], portfolio = {} }) {
  // 1. Trek de namen van de asset classes uit de data. 
  // Als er geen data is, gebruiken we een veilige default lijst.
  const assetClassNames = assetClasses.length > 0
    ? assetClasses.map(ac => ac.name)
    : ["Equities", "Fixed Income", "Alternatives", "Real Estate", "Commodities", "Cash"];

  // 2. Trek de sectornamen uit de allocatie data. 
  // Let op: we checken hier op 'sectorAllocation' (jouw mockData naam) en 'sectors' (oude naam).
  const currentSectors = portfolio.sectorAllocation || portfolio.sectors || [];
  
  const sectorNames = currentSectors.length > 0
    ? currentSectors.map(s => s.name)
    : ["Technology", "Healthcare", "Financials", "Consumer", "Energy", "Industrials", "Utilities", "Materials"];

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <Grid3X3 className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Correlatie Analyse</h2>
          <p className="text-sm text-slate-400">Gebaseerd op 5-jaars voortschrijdende historische data</p>
        </div>
      </motion.div>

      {/* Info Message */}
      <div className="flex items-start gap-3 p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
        <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
        <p className="text-sm text-slate-300 leading-relaxed">
          Correlatie meet hoe activa ten opzichte van elkaar bewegen. Een waarde van **1.0** betekent dat ze exact gelijk bewegen, terwijl **-1.0** betekent dat ze in tegengestelde richting bewegen. Diversificatie werkt het beste bij lage of negatieve correlaties.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-10">
        {/* Asset Class Correlation Matrix */}
        <CorrelationMatrix
          title="Cross-Asset Correlaties"
          subtitle="Verbanden tussen verschillende beleggingscategorieën"
          items={assetClassNames}
          correlations={ASSET_CLASS_CORRELATIONS}
        />

        {/* Sector Correlation Matrix */}
        <CorrelationMatrix
          title="Sector Correlaties"
          subtitle="Samenhang tussen specifieke aandelensectoren"
          items={sectorNames}
          correlations={SECTOR_CORRELATIONS}
        />
      </div>
    </div>
  );
}