'use client';

import { motion, AnimatePresence, Variants } from "framer-motion";
import DashboardContent from "@/components/features/overviewTab/tabOrchestrator";
import CorrelationsTab from "@/components/features/correlationsTab/correlationsTab";
import StrategyTab from "@/components/features/strategyTab/strategyTab";
import CalculationsTab from "@/components/features/calculationsTab/calculationsTab";
import RiskTab from "@/components/features/riskTab/riskTab";
import PortfolioEditor from "@/components/features/portfolioEditor/portfolioEditor"; // Nieuwe import
import { Portfolio } from "@/types";
import SettingsTab from "@/components/features/settingsTab/settingsTab";

interface TabRendererProps {
  activeTab: string;
  portfolio: Portfolio;
  onAssetClick: (item: any) => void; 
}

const tabVariants: Variants = {
  initial: { opacity: 0, y: 10, filter: "blur(8px)" },
  animate: { 
    opacity: 1, 
    y: 0, 
    filter: "blur(0px)",
    transition: { duration: 0.3, ease: "easeOut" } 
  },
  exit: { 
    opacity: 0, 
    y: -10, 
    filter: "blur(8px)",
    transition: { duration: 0.2, ease: "easeIn" } 
  }
};

export default function TabRenderer({ activeTab, portfolio, onAssetClick }: TabRendererProps) {
  return (
    <div className="relative w-full min-h-[500px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          variants={tabVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="w-full"
        >
          {renderTabContent(activeTab, portfolio, onAssetClick)}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function renderTabContent(activeTab: string, portfolio: Portfolio, onAssetClick: (item: any) => void) {
  switch (activeTab) {
    case "Overview":
      return <DashboardContent portfolio={portfolio} onAssetClick={onAssetClick} showOnly="overview" />;
    
    case "Asset Classes":
      return <DashboardContent portfolio={portfolio} onAssetClick={onAssetClick} showOnly="assets" />;

    case "Editor": // MATCHT MET DE ID IN JE SIDEBAR
      return (
        <div className="max-w-5xl mx-auto py-4">
          <PortfolioEditor portfolio={portfolio} />
        </div>
      );

    case "Risk":
      return <RiskTab portfolio={portfolio} />;

    case "Correlations":
      return <CorrelationsTab portfolio={portfolio} />;

    case "Strategy":
      return <StrategyTab portfolio={portfolio} />;

    case "Calculator":
      return <CalculationsTab portfolio={portfolio} />;

    // Fallbacks voor nog niet geïmplementeerde tabs uit je sidebar
    case "History":
    case "Markets":
    case "Calendar":
      return (
        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-800/40 rounded-[2rem] bg-slate-900/10">
          <div className="p-4 bg-blue-500/10 rounded-full mb-4 animate-pulse">
            <span className="text-blue-400 font-black tracking-widest uppercase text-[10px]">Module Pending</span>
          </div>
          <p className="text-slate-500 font-mono text-[10px] uppercase tracking-[0.3em]">
            Integration for {activeTab} is currently in calibration
          </p>
        </div>
      );
    case "Settings":
      return <SettingsTab />;


    default:
      return <DashboardContent portfolio={portfolio} onAssetClick={onAssetClick} showOnly="overview" />;
  }
}