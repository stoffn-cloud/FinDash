"use client";

import { Trash2, Calendar, DollarSign, Layers, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ExistingHoldingRow = ({ holding, onDelete, isDemoMode, availableAssets = [] }: any) => {
  // Zoek de volledige asset informatie op basis van de ticker_id in de holding
  const assetInfo = availableAssets.find((a: any) => Number(a.ticker_id) === Number(holding.ticker_id));

  return (
    <div className="group flex items-center justify-between p-4 rounded-2xl border border-white/5 bg-slate-950/40 hover:bg-slate-900/60 hover:border-blue-500/20 transition-all duration-300">
      <div className="flex items-center gap-8">
        
        {/* 1. INSTRUMENT (Ticker + Full Name) */}
        <div className="min-w-[140px] max-w-[200px]">
          <span className="flex items-center gap-1 text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">
            Instrument
          </span>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-white uppercase leading-none">
              {assetInfo?.ticker || (holding.ticker_id === 0 ? "Unknown" : `ID: ${holding.ticker_id}`)}
            </span>
            <span className="text-[10px] text-slate-500 truncate mt-0.5">
              {assetInfo?.full_name || "No asset selected"}
            </span>
          </div>
        </div>

        {/* 2. DATE */}
        <div>
          <span className="flex items-center gap-1 text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">
            <Calendar className="w-2.5 h-2.5" /> Date
          </span>
          <span className="text-xs text-slate-300 font-medium">
            {new Date(holding.purchaseDate).toLocaleDateString('nl-NL', { day: '2-digit', month: 'short', year: 'numeric' })}
          </span>
        </div>

        {/* 3. PRICE */}
        <div>
          <span className="flex items-center gap-1 text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">
            <DollarSign className="w-2.5 h-2.5" /> Price
          </span>
          <span className="text-xs text-emerald-400 font-mono font-bold">${Number(holding.purchasePrice).toFixed(2)}</span>
        </div>

        {/* 4. QUANTITY */}
        <div>
          <span className="flex items-center gap-1 text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">
            <Layers className="w-2.5 h-2.5" /> Qty
          </span>
          <span className="text-xs text-white font-mono">{holding.quantity}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
         {holding.ticker_id === 0 && (
          <span className="text-[8px] bg-rose-500/10 text-rose-500 border border-rose-500/20 px-2 py-1 rounded-full uppercase font-black animate-pulse">
            Fix Required
          </span>
        )}
        
        <Button 
          variant="ghost" 
          size="icon" 
          disabled={isDemoMode}
          onClick={() => onDelete(holding.id)}
          className="md:opacity-0 group-hover:opacity-100 h-9 w-9 text-slate-600 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};