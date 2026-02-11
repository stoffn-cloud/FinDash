'use client';

import DashboardContent from "@/components/dashboard/DashboardContent";
import CorrelationsTab from "@/components/dashboard/CorrelationsTab";
import StrategyTab from "@/components/dashboard/StrategyTab";
import CalculationsTab from "@/components/dashboard/CalculationsTab";
import RiskTab from "@/components/dashboard/RiskTab"; // Indien dit een apart bestand is
import { PortfolioItem } from "@/types";

interface TabRendererProps {
  activeTab: string;
  portfolio: PortfolioItem[];
  onAssetClick: (asset: any) => void;
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