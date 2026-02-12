'use client';

import DashboardContent from "@/components/features/overviewTab/dashboardContent";
import CorrelationsTab from "@/components/features/correlationsTab/correlationsTab";
import StrategyTab from "@/components/features/strategyTab/strategyTab";
import CalculationsTab from "@/components/features/calculationsTab/calculationsTab";
import RiskTab from "@/components/features/riskTab/riskTab";
import { Portfolio, EnrichedHolding } from "@/types"; // PortfolioItem is nu Portfolio

interface TabRendererProps {
  activeTab: string;
  portfolio: Portfolio; // Het volledige berekende object
  onAssetClick: (asset: EnrichedHolding) => void;
}

export default function TabRenderer({ activeTab, portfolio, onAssetClick }: TabRendererProps) {
  // Map de tab naam naar de juiste component
  switch (activeTab) {
    case "Overview":
      return <DashboardContent portfolio={portfolio} onAssetClick={onAssetClick} showOnly="overview" />;
    case "Asset Classes":
      return <DashboardContent portfolio={portfolio} onAssetClick={onAssetClick} showOnly="assets" />;
    case "Risk":
      return <RiskTab portfolio={portfolio} />;
    case "Correlations":
      return <CorrelationsTab portfolio={portfolio} />;
    case "Strategy":
      return <StrategyTab portfolio={portfolio} />;
    case "Calculator":
      return <CalculationsTab portfolio={portfolio} />;
    default:
      return <DashboardContent portfolio={portfolio} onAssetClick={onAssetClick} showOnly="overview" />;
  }
}