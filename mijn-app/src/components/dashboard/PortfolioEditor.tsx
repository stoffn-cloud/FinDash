"use client";

import React, { useState } from "react";
import { Plus, Trash2, Save, Search, Database, Hash, DollarSign, Loader2 } from "lucide-react";
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

const DEFAULT_PORTFOLIO: Asset[] = [
  { id: "default-1", ticker: "AAPL", name: "Apple Inc.", amount: 10, price: 180, assetClass: "Equities" },
  { id: "default-2", ticker: "BTC-USD", name: "Bitcoin", amount: 0.5, price: 45000, assetClass: "Crypto" },
  { id: "default-3", ticker: "TSLA", name: "Tesla, Inc.", amount: 15, price: 200, assetClass: "Equities" }
];

export default function PortfolioEditor({ initialAssets = [], onSave }: any) {
  const [assets, setAssets] = useState<Asset[]>(initialAssets.length > 0 ? initialAssets : DEFAULT_PORTFOLIO);
  const [isDefault, setIsDefault] = useState(initialAssets.length === 0);
  const [suggestions, setSuggestions] = useState([]);
  const [activeSearchId, setActiveSearchId] = useState<string | null>(null);

  // De functie die de "switch" omzet van Default naar Eigen data
  const handleDataChange = (id: string, field: keyof Asset, value: any) => {
    if (isDefault) {
      // Zodra je iets wijzigt, wissen we de hele lijst en houden we alleen de gewijzigde rij over
      const changedAsset = DEFAULT_PORTFOLIO.find(a => a.id === id);
      if (changedAsset) {
        setAssets([{ ...changedAsset, [field]: value }]);
      }
      setIsDefault(false);
    } else {
      // Normale update als we al in "eigen modus" zitten
      setAssets(prev => prev.map(a => a.id === id ? { ...a, [field]: value } : a));
    }
  };

  const searchTicker = async (id: string, query: string) => {
    const upperQuery = query.toUpperCase();
    handleDataChange(id, "ticker", upperQuery); // Triggert de switch
    
    if (upperQuery.length < 2) return;
    setActiveSearchId(id);

    try {
      const response = await fetch(`http://localhost:5000/api/search?q=${upperQuery}`);
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error("Zoekfout:", error);
    }
  };

  const addRow = () => {
    const newAsset = { id: Math.random().toString(36).substring(2, 9), ticker: "", name: "", amount: 0, price: 0, assetClass: "Equities" };
    if (isDefault) {
      setAssets([newAsset]);
      setIsDefault(false);
    } else {
      setAssets([...assets, newAsset]);
    }
  };

  const removeRow = (id: string) => {
    const updated = assets.filter(a => a.id !== id);
    if (updated.length === 0) {
      setAssets(DEFAULT_PORTFOLIO);
      setIsDefault(true);
    } else {
      setAssets(updated);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white/[0.02] border border-white/5 p-4 rounded-3xl">
        <div className="flex items-center gap-4">
          <Database className="w-5 h-5 text-blue-500" />
          <div>
            <h3 className="text-sm font-black text-white uppercase italic">Asset Ledger</h3>
            <p className="text-[10px] text-slate-500 uppercase">{isDefault ? "Voorbeeld Data" : "Eigen Portfolio"}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button onClick={addRow} variant="outline" className="rounded-xl border-white/10 text-[10px] font-black uppercase">
            + Add Position
          </Button>
          <Button onClick={() => onSave(assets)} className="rounded-xl bg-blue-600 text-[10px] font-black uppercase">
            Commit Changes
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {assets.map((asset) => (
          <div key={asset.id} className="grid grid-cols-12 gap-4 bg-black/20 border border-white/5 p-3 rounded-2xl items-center relative">
            <div className="col-span-2 relative">
              <Input 
                value={asset.ticker}
                onChange={(e) => searchTicker(asset.id, e.target.value)}
                onFocus={() => setActiveSearchId(asset.id)}
                className="bg-slate-900/50 border-white/5 text-xs font-mono font-bold uppercase"
              />
              {activeSearchId === asset.id && suggestions.length > 0 && (
                <div className="absolute z-[999] left-0 right-0 mt-2 bg-slate-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                  {suggestions.map((s: any) => (
                    <button
                      key={s.ticker + s.name}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        const finalAsset = { ...asset, ticker: s.ticker, name: s.name };
                        if (isDefault) {
                           setAssets([finalAsset]);
                           setIsDefault(false);
                        } else {
                           setAssets(prev => prev.map(a => a.id === asset.id ? finalAsset : a));
                        }
                        setSuggestions([]);
                        setActiveSearchId(null);
                      }}
                      className="w-full px-4 py-2 hover:bg-blue-600/20 text-left"
                    >
                      <div className="text-[10px] font-black text-blue-400">{s.ticker}</div>
                      <div className="text-[8px] text-slate-500 uppercase">{s.name}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="col-span-3">
              <Input value={asset.name} onChange={(e) => handleDataChange(asset.id, "name", e.target.value)} className="bg-slate-900/50 border-white/5 text-xs" />
            </div>
            <div className="col-span-2">
              <Input type="number" value={asset.amount} onChange={(e) => handleDataChange(asset.id, "amount", parseFloat(e.target.value) || 0)} className="bg-slate-900/50 border-white/5 text-xs text-center" />
            </div>
            <div className="col-span-2">
              <Input type="number" value={asset.price} onChange={(e) => handleDataChange(asset.id, "price", parseFloat(e.target.value) || 0)} className="bg-slate-900/50 border-white/5 text-xs text-center text-emerald-400" />
            </div>
            <div className="col-span-2">
              <select value={asset.assetClass} onChange={(e) => handleDataChange(asset.id, "assetClass", e.target.value)} className="w-full h-10 bg-slate-900/50 border border-white/5 rounded-md px-2 text-[10px] text-slate-400">
                <option value="Equities">Equities</option>
                <option value="Crypto">Crypto</option>
              </select>
            </div>
            <div className="col-span-1 flex justify-center">
              <button onClick={() => removeRow(asset.id)} className="p-2 text-slate-600 hover:text-rose-500">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}