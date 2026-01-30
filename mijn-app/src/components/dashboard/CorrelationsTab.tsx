import { motion } from "framer-motion";
import { Grid3X3, AlertCircle } from "lucide-react";
import CorrelationMatrix from "@/components/dashboard/CorrelationMatrix";

// Types
type Sector = { name: string; [key: string]: any };
type Portfolio = { sectorAllocation?: Sector[]; sectors?: Sector[]; [key: string]: any };
type AssetClass = { name: string; [key: string]: any };

interface CorrelationsTabProps {
  assetClasses?: AssetClass[];
  portfolio?: Portfolio;
}

// Statische correlaties
const ASSET_CLASS_CORRELATIONS = { /* ...same as before... */ };
const SECTOR_CORRELATIONS = { /* ...same as before... */ };

export default function CorrelationsTab({ assetClasses = [], portfolio = {} }: CorrelationsTabProps) {
  // Asset class names
  const assetClassNames = assetClasses.length > 0
    ? assetClasses.map(ac => ac.name)
    : ["Equities", "Fixed Income", "Alternatives", "Real Estate", "Commodities", "Cash"];

  // Sector names
  const currentSectors: Sector[] = portfolio.sectorAllocation || portfolio.sectors || [];
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
          Correlatie meet hoe activa ten opzichte van elkaar bewegen. Een waarde van <b>1.0</b> betekent dat ze exact gelijk bewegen, terwijl <b>-1.0</b> betekent dat ze in tegengestelde richting bewegen. Diversificatie werkt het beste bij lage of negatieve correlaties.
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
