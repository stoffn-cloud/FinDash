"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Trash2, 
  Save, 
  Search, 
  Database, 
  AlertCircle,
  Hash,
  DollarSign,
  Loader2
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Asset {
  id: string;
  ticker: string;
  name: string;
  amount: number;
  price: number;
  assetClass: string;
}

interface Suggestion {
  ticker: string;
  name: string;
  exchange: string;
}

interface PortfolioEditorProps {
  initialAssets: Asset[];
  onSave: (assets: Asset[]) => void;
}

export default function PortfolioEditor({ initialAssets = [], onSave }: PortfolioEditorProps) {
  // Zorg dat assets altijd een array is bij opstarten
  const [assets, setAssets] = useState<Asset[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [activeSearchId, setActiveSearchId] = useState<string | null>(null);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);

  // Synchroniseer initialAssets alleen bij het laden of als ze echt veranderen
  useEffect(() => {
    if (initialAssets && initialAssets.length > 0) {
      setAssets(initialAssets);
    }
  }, [initialAssets]);

  // Zoekfunctie met foutafhandeling
  const searchTicker = async (id: string, query: string) => {
    const upperQuery = query.toUpperCase();
    
    // Direct de tekst updaten in de UI
    updateAsset(id, "ticker", upperQuery);
    
    if (upperQuery.length < 2) {
      setSuggestions([]);
      setActiveSearchId(null);
      return;
    }

    setIsLoadingSearch(true);
    setActiveSearchId(id);

    try {
      const response = await fetch(`http://localhost:5000/api/search?q=${upperQuery}`);
      if (!response.ok) throw new Error("Netwerk response was niet ok");
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error("Zoekfout:", error);
      setSuggestions([]);
    } finally {
      setIsLoadingSearch(false);
    }
  };

  const selectSuggestion = (id: string, suggestion: Suggestion) => {
    setAssets(prev => prev.map(a => a.id === id ? { 
      ...a, 
      ticker: suggestion.ticker, 
      name: suggestion.name 
    } : a));
    setSuggestions([]);
    setActiveSearchId(null);
  };

  const addRow = () => {
    const newAsset: Asset = {
      id: Math.random().toString(36).substring(2, 9),
      ticker: "",
      name: "",
      amount: 0,
      price: 0,
      assetClass: "Equities",
    };
    setAssets([...assets, newAsset]);
  };

  const updateAsset = (id: string, field: keyof Asset, value: string | number) => {
    setAssets(prev => prev.map(a => a.id === id ? { ...a, [field]: value } : a));
  };

  const removeRow = (id: string) => {
    setAssets(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex items-center justify-between bg-white/[0.02] border border-white/5 p-4 rounded-3xl backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <Database className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-widest italic">Asset Ledger</h3>
            <p className="text-[10px] font-mono text-slate-500 uppercase">Position Management</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={addRow}
            variant="outline" 
            className="rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-widest h-10 px-6"
          >
            <Plus className="w-3 h-3 mr-2 text-emerald-500" /> Add Position
          </Button>
          <Button 
            onClick={() => onSave(assets)}
            className="rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest h-10 px-6 shadow-[0_0_15px_rgba(37,99,235,0.3)]"
          >
            <Save className="w-3 h-3 mr-2" /> Commit Changes
          </Button>
        </div>
      </div>

      {/* Assets Grid */}
      <div className="space-y-3">
        <div className="grid grid-cols-12 gap-4 px-6 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">
          <div className="col-span-2">Ticker</div>
          <div className="col-span-3">Asset Name</div>
          <div className="col-span-2 text-center">Quantity</div>
          <div className="col-span-2 text-center">Avg. Price</div>
          <div className="col-span-2">Class</div>
          <div className="col-span-1"></div>
        </div>

        <div className="min-h-[100px] relative">
          <AnimatePresence mode="popLayout">
            {assets.map((asset, index) => (
              <motion.div
                key={asset.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="grid grid-cols-12 gap-4 bg-black/20 border border-white/5 p-3 rounded-2xl items-center group mb-3 relative"
              >
                {/* Ticker Input */}
                <div className="col-span-2 relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
                    {isLoadingSearch && activeSearchId === asset.id ? (
                      <Loader2 className="w-3 h-3 text-blue-500 animate-spin" />
                    ) : (
                      <Search className="w-3 h-3 text-slate-600" />
                    )}
                  </div>
                  <Input 
                    value={asset.ticker}
                    onChange={(e) => searchTicker(asset.id, e.target.value)}
                    onFocus={() => setActiveSearchId(asset.id)}
                    className="bg-slate-900/50 border-white/5 pl-8 text-xs font-mono font-bold uppercase"
                    placeholder="AAPL..."
                  />

                  {/* Suggestion Dropdown */}
                  {activeSearchId === asset.id && suggestions.length > 0 && (
                    <div className="absolute z-[999] left-0 right-0 mt-2 bg-slate-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl">
                      {suggestions.map((s) => (
                        <button
                          key={s.ticker + s.name}
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault(); // Voorkomt dat onBlur de klik blokkeert
                            selectSuggestion(asset.id, s);
                          }}
                          className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-blue-600/20 text-left border-b border-white/[0.03] last:border-0"
                        >
                          <div className="flex flex-col">
                            <span className="text-[10px] font-black text-blue-400">{s.ticker}</span>
                            <span className="text-[8px] text-slate-500 uppercase">{s.name}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="col-span-3">
                  <Input 
                    value={asset.name}
                    onChange={(e) => updateAsset(asset.id, "name", e.target.value)}
                    className="bg-slate-900/50 border-white/5 text-xs"
                    placeholder="Name"
                  />
                </div>

                <div className="col-span-2">
                  <Input 
                    type="number"
                    value={asset.amount}
                    onChange={(e) => updateAsset(asset.id, "amount", parseFloat(e.target.value) || 0)}
                    className="bg-slate-900/50 border-white/5 text-xs text-center"
                  />
                </div>

                <div className="col-span-2">
                  <Input 
                    type="number"
                    value={asset.price}
                    onChange={(e) => updateAsset(asset.id, "price", parseFloat(e.target.value) || 0)}
                    className="bg-slate-900/50 border-white/5 text-xs text-center text-emerald-400"
                  />
                </div>

                <div className="col-span-2">
                  <select 
                    value={asset.assetClass}
                    onChange={(e) => updateAsset(asset.id, "assetClass", e.target.value)}
                    className="w-full h-10 bg-slate-900/50 border border-white/5 rounded-md px-3 text-[10px] text-slate-400"
                  >
                    <option value="Equities">Equities</option>
                    <option value="Crypto">Crypto</option>
                  </select>
                </div>

                <div className="col-span-1 flex justify-center">
                  <button onClick={() => removeRow(asset.id)} className="p-2 text-slate-600 hover:text-rose-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {assets.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-3xl">
           <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">No positions found</p>
        </div>
      )}
    </div>
  );
}