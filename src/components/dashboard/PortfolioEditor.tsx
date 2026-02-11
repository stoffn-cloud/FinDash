"use client";

import React, { useState, useEffect } from "react";
import { Trash2, Plus, Save, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Portfolio } from "@/types/dashboard";

interface PortfolioEditorProps {
  portfolio: Portfolio;
}

export default function PortfolioEditor({ portfolio }: PortfolioEditorProps) {
  // We gebruiken de data die we via props binnenkrijgen
  const [selectedAssetClassId, setSelectedAssetClassId] = useState<string>(
    portfolio.assetClasses?.[0]?.id || ""
  );
  
  const [holdings, setHoldings] = useState<any[]>([]);

  // Update de lijst met tickers wanneer de categorie verandert
  useEffect(() => {
    const activeClass = portfolio.assetClasses?.find((a) => a.id === selectedAssetClassId);
    if (activeClass) {
      setHoldings(activeClass.holdings || []);
    }
  }, [selectedAssetClassId, portfolio]);

  const handleHoldingChange = (index: number, field: string, value: string | number) => {
    const newHoldings = [...holdings];
    newHoldings[index] = { ...newHoldings[index], [field]: value };
    setHoldings(newHoldings);
  };

  const addHolding = () => {
    setHoldings([...holdings, { name: "New Asset", ticker: "", weight: 0, value: 0 }]);
  };

  const removeHolding = (index: number) => {
    setHoldings(holdings.filter((_, i) => i !== index));
  };

  const saveChanges = () => {
    console.log("Saving changes for", selectedAssetClassId, holdings);
    alert("Wijzigingen lokaal opgeslagen (Check console)");
    // Hier kun je later een API call toevoegen
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
            <h3 className="text-white font-bold uppercase tracking-tighter">Asset Manager</h3>
            <p className="text-slate-500 text-[10px] font-mono uppercase">Engine Configuration</p>
          </div>
        </div>

        <select 
          value={selectedAssetClassId} 
          onChange={(e) => setSelectedAssetClassId(e.target.value)}
          className="bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2 text-xs font-bold outline-none focus:border-blue-500/50"
        >
          {portfolio.assetClasses?.map((ac) => (
            <option key={ac.id} value={ac.id}>{ac.name}</option>
          ))}
        </select>
      </div>

      {/* Editor Lijst */}
      <div className="p-6 space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar">
        {holdings.map((holding, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-slate-900/60 p-4 rounded-2xl border border-white/5 items-center group hover:border-blue-500/30 transition-all">
            <div className="md:col-span-5 space-y-1">
              <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Asset Name</span>
              <input 
                value={holding.name} 
                onChange={(e) => handleHoldingChange(index, 'name', e.target.value)}
                className="w-full bg-transparent text-white text-sm font-bold outline-none"
              />
            </div>
            <div className="md:col-span-3 space-y-1">
              <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Ticker</span>
              <input 
                value={holding.ticker} 
                onChange={(e) => handleHoldingChange(index, 'ticker', e.target.value)}
                className="w-full bg-transparent text-blue-400 font-mono text-sm outline-none"
              />
            </div>
            <div className="md:col-span-2 space-y-1">
              <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Weight %</span>
              <input 
                type="number"
                value={holding.weight} 
                onChange={(e) => handleHoldingChange(index, 'weight', parseFloat(e.target.value))}
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
        ))}
      </div>

      {/* Actie Knoppen */}
      <div className="p-6 border-t border-slate-800 bg-white/[0.01] flex justify-between items-center">
        <Button 
          variant="ghost"
          onClick={addHolding}
          className="flex items-center gap-2 text-[10px] font-black text-blue-400 hover:text-blue-300 uppercase tracking-widest"
        >
          <Plus className="w-4 h-4" /> Add Instrument
        </Button>

        <Button 
          onClick={saveChanges}
          className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest"
        >
          <Save className="w-4 h-4 mr-2" /> Commit Changes
        </Button>
      </div>
    </div>
  );
}