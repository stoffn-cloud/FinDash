"use client";

import React, { useState } from "react";
import { Trash2, Plus, Database } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// 1. Export de interface voor gebruik in Dashboard.tsx
export interface Asset {
  id: string;
  ticker: string;
  name: string;
  amount: number;
  price: number;
  assetClass: string;
}

// 2. Export de lijst en zet prijzen op 0 (zodat de Live Engine ze ophaalt)
export const DEFAULT_PORTFOLIO: Asset[] = [
  { id: "def-1", ticker: "AAPL", name: "Apple Inc.", amount: 150, price: 0, assetClass: "Equity" },
  { id: "def-2", ticker: "MSFT", name: "Microsoft Corp", amount: 80, price: 0, assetClass: "Equity" },
  { id: "def-3", ticker: "NVDA", name: "NVIDIA Corp", amount: 25, price: 0, assetClass: "Equity" },
  { id: "def-4", ticker: "ASML", name: "ASML Holding", amount: 15, price: 0, assetClass: "Equity" },
  { id: "def-5", ticker: "TSLA", name: "Tesla, Inc.", amount: 60, price: 0, assetClass: "Equity" },
  { id: "def-6", ticker: "GOOGL", name: "Alphabet Inc.", amount: 100, price: 0, assetClass: "Equity" },
  { id: "def-7", ticker: "META", name: "Meta Platforms", amount: 45, price: 0, assetClass: "Equity" },
  { id: "def-8", ticker: "LVMUY", name: "LVMH Moet Hennessy", amount: 10, price: 0, assetClass: "Equity" },
  { id: "def-9", ticker: "BRK-B", name: "Berkshire Hathaway", amount: 30, price: 0, assetClass: "Equity" },
  { id: "def-10", ticker: "JPM", name: "JPMorgan Chase & Co", amount: 75, price: 0, assetClass: "Equity" },
  { id: "def-11", ticker: "NSRGY", name: "Nestlé S.A.", amount: 120, price: 0, assetClass: "Equity" },
  { id: "def-12", ticker: "BTC-USD", name: "Bitcoin", amount: 1.2, price: 0, assetClass: "Crypto" },
  { id: "def-13", ticker: "GLD", name: "SPDR Gold Shares", amount: 50, price: 0, assetClass: "Commodities" },
  { id: "def-14", ticker: "TLT", name: "iShares 20+ Yr Treasury Bond", amount: 200, price: 0, assetClass: "FixedIncome" },
  { id: "def-15", ticker: "IEF", name: "iShares 7-10 Yr Treasury Bond", amount: 150, price: 0, assetClass: "FixedIncome" },
  { id: "def-16", ticker: "SHY", name: "iShares 1-3 Yr Treasury Bond", amount: 300, price: 0, assetClass: "FixedIncome" },
  { id: "def-17", ticker: "VUSA.AS", name: "Vanguard S&P 500 UCITS", amount: 400, price: 0, assetClass: "Equity" },
  { id: "def-18", ticker: "IWDA.AS", name: "iShares Core MSCI World", amount: 600, price: 0, assetClass: "Equity" },
  { id: "def-19", ticker: "QQQ", name: "Invesco QQQ Trust", amount: 50, price: 0, assetClass: "Equity" },
  { id: "def-20", ticker: "VNQ", name: "Vanguard Real Estate ETF", amount: 100, price: 0, assetClass: "RealEstate" }
];

interface PortfolioEditorProps {
  initialAssets: Asset[];
  onSave: (assets: Asset[]) => void;
}

export default function PortfolioEditor({ initialAssets = [], onSave }: PortfolioEditorProps) {
  // We gebruiken initialAssets als die er zijn, anders de defaults
  const [assets, setAssets] = useState<Asset[]>(initialAssets.length > 0 ? initialAssets : DEFAULT_PORTFOLIO);
  const [isDefault, setIsDefault] = useState(initialAssets.length === 0);

  const handleUpdate = (id: string, field: keyof Asset, value: any) => {
    if (isDefault) {
      // Switch van 'Simulatie' naar 'User Mode' bij de eerste wijziging
      const targetRow = assets.find(a => a.id === id);
      if (!targetRow) return;
      
      const newAsset = { 
        ...targetRow, 
        [field]: value, 
        id: "user-" + Math.random().toString(36).substring(2, 7) 
      };
      setAssets([newAsset]);
      setIsDefault(false);
    } else {
      setAssets(prev => prev.map(a => a.id === id ? { ...a, [field]: value } : a));
    }
  };

  const addRow = () => {
    const newRow: Asset = { 
      id: "user-" + Math.random().toString(36).substring(2, 7), 
      ticker: "", 
      name: "", 
      amount: 0, 
      price: 0, 
      assetClass: "Equity" 
    };
    if (isDefault) {
      setAssets([newRow]);
      setIsDefault(false);
    } else {
      setAssets([...assets, newRow]);
    }
  };

  const deleteRow = (id: string) => {
    const filtered = assets.filter(a => a.id !== id);
    if (filtered.length === 0) {
      setAssets(DEFAULT_PORTFOLIO);
      setIsDefault(true);
    } else {
      setAssets(filtered);
    }
  };

  return (
    <div className="space-y-4 bg-slate-900/20 p-6 rounded-3xl border border-white/5">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-black italic uppercase text-white flex items-center gap-2">
            <Database className="text-blue-500 w-5 h-5" /> Asset Ledger
          </h2>
          <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em]">
            {isDefault ? "Viewing Default Simulation" : "Custom Portfolio Active"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={addRow} variant="outline" className="h-9 text-[10px] font-black uppercase border-white/10 hover:bg-white/5 rounded-xl">
            <Plus className="w-3 h-3 mr-1" /> Add Position
          </Button>
          <Button onClick={() => onSave(assets)} className="h-9 text-[10px] font-black uppercase bg-blue-600 hover:bg-blue-500 rounded-xl px-6">
            Commit Changes
          </Button>
        </div>
      </div>

      <div className="max-h-[500px] overflow-y-auto pr-2 space-y-2 scrollbar-thin scrollbar-thumb-slate-800">
        {assets.map((asset) => (
          <div key={asset.id} className="grid grid-cols-12 gap-3 bg-white/[0.02] border border-white/5 p-2 rounded-2xl items-center">
            <div className="col-span-2">
              <Input 
                value={asset.ticker} 
                placeholder="TICKER"
                onChange={(e) => handleUpdate(asset.id, "ticker", e.target.value.toUpperCase())}
                className="bg-slate-950/50 border-white/5 text-[10px] font-mono font-bold h-9"
              />
            </div>
            <div className="col-span-3">
              <Input 
                value={asset.name} 
                placeholder="Asset Name"
                onChange={(e) => handleUpdate(asset.id, "name", e.target.value)}
                className="bg-slate-950/50 border-white/5 text-[10px] h-9"
              />
            </div>
            <div className="col-span-2">
              <Input 
                type="number" 
                value={asset.amount} 
                onChange={(e) => handleUpdate(asset.id, "amount", parseFloat(e.target.value) || 0)}
                className="bg-slate-950/50 border-white/5 text-[10px] text-center h-9 font-mono"
              />
            </div>
            <div className="col-span-3 text-xs">
               <select 
                 value={asset.assetClass} 
                 onChange={(e) => handleUpdate(asset.id, "assetClass", e.target.value)}
                 className="w-full bg-slate-950/50 border border-white/5 rounded-lg h-9 text-[10px] px-2 text-slate-400"
               >
                 <option value="Equity">Equity</option>
                 <option value="FixedIncome">Fixed Income</option>
                 <option value="Crypto">Crypto</option>
                 <option value="Commodities">Commodities</option>
                 <option value="RealEstate">Real Estate</option>
               </select>
            </div>
            <div className="col-span-2 flex justify-end gap-2">
              <button onClick={() => deleteRow(asset.id)} className="p-2 text-slate-600 hover:text-rose-500 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}