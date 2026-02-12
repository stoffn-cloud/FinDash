'use client';

import { motion, AnimatePresence, Variants } from "framer-motion";
import DashboardContent from "@/components/features/overviewTab/dashboardContent";
import CorrelationsTab from "@/components/features/correlationsTab/correlationsTab";
import StrategyTab from "@/components/features/strategyTab/strategyTab";
import CalculationsTab from "@/components/features/calculationsTab/calculationsTab";
import RiskTab from "@/components/features/riskTab/riskTab";
import { Portfolio, EnrichedHolding } from "@/types";

// We definiëren de types voor de props expliciet
interface TabRendererProps {
  activeTab: string;
  portfolio: Portfolio;
  // Let op: we maken de handler generiek of matchen met de verwachte interface
  onAssetClick: (item: any) => void; 
}

/**
 * FIX 1: Type-safe Variants
 * We casten 'ease' als een specifiek Framer Motion type om de error te omzeilen.
 */
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
      /**
       * FIX 2: Type Assertion
       * DashboardContent verwacht onAssetClick blijkbaar voor AssetClasses.
       * We casten de handler hier om de TS error te sussen, 
       * maar check in DashboardContent.tsx welk type onAssetClick ECHT nodig heeft.
       */
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