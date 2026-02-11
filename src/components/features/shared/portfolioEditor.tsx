"use client";

import React, { useState, useEffect } from "react";
import { Trash2, Plus, Save, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Portfolio, EnrichedAssetClass } from "@/types";

// 1. Lokale interface die exact matcht met de formulier-velden
interface EditableHolding {
  name: string;
  ticker: string;
  allocation_percent: number;
  [key: string]: any; // Laat extra database velden toe zonder errors
}

interface PortfolioEditorProps {
  portfolio: Portfolio;
}

export default function PortfolioEditor({ portfolio }: PortfolioEditorProps) {
  // 2. Gebruik assetAllocation van de SQL Engine
  const [selectedAssetClassId, setSelectedAssetClassId] = useState<number | string>(
    portfolio.assetAllocation?.[0]?.id || ""
  );
  
  const [holdings, setHoldings] = useState<EditableHolding[]>([]);

  // 3. Sync de editor-state wanneer de categorie-selectie wijzigt
  useEffect(() => {
    const activeClass = portfolio.assetAllocation?.find(
      (ac: EnrichedAssetClass) => ac.id === selectedAssetClassId
    );
    
    if (activeClass) {
      // Map de database/engine velden naar onze editable velden
      const mappedHoldings: EditableHolding[] = (activeClass.assets || []).map((a: any) => ({
        ...a,
        name: a.name || a.asset_name || "", 
        ticker: a.ticker || "",
        allocation_percent: a.allocation_percent || 0
      }));
      setHoldings(mappedHoldings);
    }
  }, [selectedAssetClassId, portfolio]);

  const handleHoldingChange = (index: number, field: keyof EditableHolding, value: string | number) => {
    const newHoldings = [...holdings];
    newHoldings[index] = { ...newHoldings[index], [field]: value };
    setHoldings(newHoldings);
  };

  const addHolding = () => {
    const newAsset: EditableHolding = { 
      name: "New Asset", 
      ticker: "", 
      allocation_percent: 0 
    };
    setHoldings([...holdings, newAsset]);
  };

  const removeHolding = (index: number) => {
    setHoldings(holdings.filter((_, i) => i !== index));
  };

  const saveChanges = () => {
    console.log("Saving changes for node:", selectedAssetClassId, holdings);
    alert("Wijzigingen klaargezet voor SQL Commit (Check console)");
  };

  return (
    <div className="bg-slate-900/40 border border-slate-800 rounded-[2rem] overflow-hidden backdrop-blur-md">
      {/* Header met Categorie Selectie */}
      <div className="p-6 border-b border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <LayoutGrid className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-white font-bold uppercase tracking-tighter">Asset Ledger Editor</h3>
            <p className="text-slate-500 text-[10px] font-mono uppercase tracking-widest italic">
              Strategy: {portfolio.name}
            </p>
          </div>
        </div>

        <select 
          value={selectedAssetClassId} 
          onChange={(e) => setSelectedAssetClassId(e.target.value)}
          className="bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2 text-xs font-bold outline-none focus:border-blue-500/50 cursor-pointer transition-all"
        >
          {portfolio.assetAllocation?.map((ac: EnrichedAssetClass) => (
            <option key={ac.id} value={ac.id}>{ac.name}</option>
          ))}
        </select>
      </div>

      {/* Editor Lijst */}
      <div className="p-6 space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar">
        {holdings.length > 0 ? (
          holdings.map((holding, index) => (
            <div 
              key={index} 
              className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-slate-900/60 p-4 rounded-2xl border border-white/5 items-center group hover:border-blue-500/30 transition-all duration-300"
            >
              <div className="md:col-span-5 space-y-1">
                <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Asset Name</span>
                <input 
                  value={holding.name} 
                  onChange={(e) => handleHoldingChange(index, 'name', e.target.value)}
                  className="w-full bg-transparent text-white text-sm font-bold outline-none placeholder:text-slate-800"
                  placeholder="e.g. NVIDIA Corporation"
                />
              </div>
              <div className="md:col-span-3 space-y-1">
                <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Ticker</span>
                <input 
                  value={holding.ticker} 
                  onChange={(e) => handleHoldingChange(index, 'ticker', e.target.value.toUpperCase())}
                  className="w-full bg-transparent text-blue-400 font-mono text-sm outline-none"
                  placeholder="TICKER"
                />
              </div>
              <div className="md:col-span-2 space-y-1">
                <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Weight %</span>
                <input 
                  type="number"
                  value={holding.allocation_percent} 
                  onChange={(e) => handleHoldingChange(index, 'allocation_percent', parseFloat(e.target.value) || 0)}
                  className="w-full bg-transparent text-white font-mono text-sm outline-none"
                />
              </div>
              <div className="md:col-span-2 flex justify-end">
                <Button 
                  variant="ghost"
                  size="icon"
                  onClick={() => removeHolding(index)}
                  className="text-slate-600 hover:text-rose-500 hover:bg-rose-500/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[2rem]">
            <p className="text-slate-600 font-mono text-[10px] uppercase tracking-[0.3em]">No instruments found in node</p>
          </div>
        )}
      </div>

      {/* Actie Knoppen */}
      <div className="p-6 border-t border-slate-800 bg-white/[0.01] flex justify-between items-center">
        <Button 
          variant="ghost"
          onClick={addHolding}
          className="flex items-center gap-2 text-[10px] font-black text-blue-400 hover:text-blue-300 uppercase tracking-widest transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Instrument
        </Button>

        <Button 
          onClick={saveChanges}
          className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(37,99,235,0.2)] transition-all active:scale-95"
        >
          <Save className="w-4 h-4 mr-2" /> Commit Changes
        </Button>
      </div>
    </div>
  );
}