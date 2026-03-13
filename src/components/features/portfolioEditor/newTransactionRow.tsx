"use client";

import { Trash2, Search, AlertCircle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect, useMemo } from "react";

export const NewTransactionRow = ({ 
  row, 
  index, 
  availableAssets = [], 
  onUpdate, 
  onRemove 
}: any) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredAssets = useMemo(() => {
    if (!searchTerm) return availableAssets.slice(0, 10);
    const s = searchTerm.toLowerCase();
    return availableAssets.filter((asset: any) => {
      const ticker = (asset.ticker || "").toLowerCase();
      const name = (asset.full_name || "").toLowerCase();
      return ticker.includes(s) || name.includes(s);
    }).slice(0, 15);
  }, [searchTerm, availableAssets]);

  const selectedAsset = availableAssets.find((a: any) => Number(a.ticker_id) === Number(row.ticker_id));

  return (
    <div className={`grid grid-cols-1 md:grid-cols-12 gap-3 p-4 rounded-2xl border items-end transition-all duration-300 ${
      selectedAsset 
        ? 'bg-slate-900/60 border-blue-500/20' 
        : 'bg-rose-500/5 border-rose-500/30'
    }`}>
      
      {/* 1. INSTRUMENT SELECTION (4 cols) */}
      <div className="md:col-span-4 space-y-1 relative" ref={wrapperRef}>
        <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest px-1">Instrument</label>
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 ${selectedAsset ? 'text-blue-500' : 'text-slate-500'}`} />
          <input 
            type="text"
            // Placeholder aangepast naar "Select asset..."
            placeholder={selectedAsset ? `${selectedAsset.ticker} — ${selectedAsset.full_name}` : "Select asset..."}
            value={searchTerm}
            onFocus={() => setIsOpen(true)}
            onChange={(e) => { setSearchTerm(e.target.value); setIsOpen(true); }}
            className={`w-full bg-slate-950 border text-white text-xs rounded-lg p-2.5 pl-9 outline-none transition-all ${
                selectedAsset 
                  ? 'border-slate-800 focus:border-blue-500' 
                  : 'border-rose-500/40 focus:border-rose-500 italic text-slate-400'
            }`}
          />
        </div>

        {isOpen && (
          <div className="absolute z-[110] left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-slate-900 border border-slate-700 rounded-xl shadow-2xl custom-scrollbar animate-in fade-in zoom-in-95">
            {filteredAssets.length > 0 ? (
              filteredAssets.map((asset: any) => (
                <div 
                  key={asset.ticker_id}
                  onClick={() => {
                    onUpdate(index, 'ticker_id', Number(asset.ticker_id));
                    setSearchTerm(""); 
                    setIsOpen(false);
                  }}
                  className="p-3 hover:bg-blue-600/20 cursor-pointer border-b border-white/5 last:border-0 flex justify-between items-center group"
                >
                  <div className="flex flex-col">
                    <span className="text-white font-bold text-xs group-hover:text-blue-400 uppercase">{asset.ticker}</span>
                    <span className="text-[10px] text-slate-500 truncate">{asset.full_name}</span>
                  </div>
                  {Number(asset.ticker_id) === Number(row.ticker_id) && <Check className="w-3 h-3 text-blue-500" />}
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-slate-500 text-[10px] uppercase tracking-widest font-mono">
                No matching assets
              </div>
            )}
          </div>
        )}
      </div>

      {/* 2. PURCHASE DATE (3 cols) */}
      <div className="md:col-span-3 space-y-1">
        <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Purchase Date</label>
        <input 
          type="date" 
          value={row.purchaseDate}
          onChange={(e) => onUpdate(index, 'purchaseDate', e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-lg p-2.5 outline-none focus:border-blue-500/50 color-scheme-dark"
        />
      </div>

      {/* 3. EXECUTION PRICE (2 cols) */}
      <div className="md:col-span-2 space-y-1">
        <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Price</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 text-[10px]">$</span>
          <input 
            type="number" step="0.01" 
            value={row.purchasePrice}
            onChange={(e) => onUpdate(index, 'purchasePrice', parseFloat(e.target.value) || 0)}
            className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-lg p-2.5 pl-7 outline-none focus:border-emerald-500/50"
          />
        </div>
      </div>

      {/* 4. QUANTITY (2 cols) */}
      <div className="md:col-span-2 space-y-1">
        <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Quantity</label>
        <input 
          type="number" step="0.001" 
          value={row.quantity}
          onChange={(e) => onUpdate(index, 'quantity', parseFloat(e.target.value) || 0)}
          className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-lg p-2.5 outline-none focus:border-emerald-500/50"
        />
      </div>

      {/* 5. REMOVE BUTTON (1 col) */}
      <div className="md:col-span-1 flex justify-end pb-1">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => onRemove(index)} 
          className="h-10 w-10 text-slate-600 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};