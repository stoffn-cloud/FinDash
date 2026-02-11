"use client"

import React, { useState } from 'react';
import { Search, Loader2, TrendingUp, TrendingDown, Globe, Zap } from 'lucide-react';
import { portfolioStore } from '@/store/portfolioStore';
import { motion, AnimatePresence } from "framer-motion";

const SearchTab = () => {
  const [ticker, setTicker] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticker) return;

    setLoading(true);
    setError(null);
    
    try {
      // De store moet deze methode ondersteunen (zie stap 2)
      const data = await portfolioStore.searchInSheet('Equities:NASDAQ', ticker.toUpperCase());
      if (data) {
        setResult(data);
      } else {
        setError("Ticker niet gevonden in NASDAQ node.");
      }
    } catch (err) {
      setError("Verbindingsfout met SQL Engine.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-20">
      {/* Header */}
      <div className="flex items-center gap-5 mb-10">
        <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.1)]">
          <Globe className="w-6 h-6 text-blue-500" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic">Global Terminal</h2>
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-1 italic">
            Access Node: <span className="text-slate-300 font-bold">NASDAQ Real-time Feed</span>
          </p>
        </div>
      </div>
      
      {/* Search Input Section */}
      <form onSubmit={handleSearch} className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition duration-1000"></div>
        <div className="relative flex gap-3 bg-black/40 border border-white/10 p-2 rounded-2xl backdrop-blur-xl">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
            <input 
              type="text" 
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
              placeholder="ENTER TICKER (E.G. NVDA, AAPL, TSLA)..."
              className="w-full bg-transparent pl-12 pr-4 py-4 font-mono text-sm text-white outline-none placeholder:text-slate-700 placeholder:italic uppercase tracking-widest"
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-500 text-white px-8 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center gap-3 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
            Execute
          </button>
        </div>
      </form>

      {/* Result Display */}
      <AnimatePresence mode="wait">
        {result ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative overflow-hidden"
          >
            <div className="bg-gradient-to-br from-slate-900/80 to-black border border-white/10 p-8 rounded-3xl backdrop-blur-2xl">
              <div className="flex justify-between items-end">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-2 py-0.5 rounded bg-blue-500/20 border border-blue-500/30 text-[10px] font-mono font-bold text-blue-400">NASDAQ</span>
                    <span className="text-slate-500 font-mono text-[10px] uppercase tracking-widest italic">Asset Node: {result.ticker}</span>
                  </div>
                  <h2 className="text-6xl font-black text-white italic tracking-tighter uppercase">{result.ticker}</h2>
                  <p className="text-slate-400 font-medium tracking-wide mt-1">{result.name || 'Equity Listing'}</p>
                </div>
                
                <div className="text-right">
                  <p className="text-5xl font-mono font-black text-white tracking-tighter mb-2">
                    ${Number(result.price).toFixed(2)}
                  </p>
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${
                    result.change >= 0 
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                      : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                  }`}>
                    {result.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    <span className="text-xs font-mono font-bold">{result.change}%</span>
                  </div>
                </div>
              </div>

              {/* Decorative data points */}
              <div className="grid grid-cols-3 gap-4 mt-10 pt-8 border-t border-white/5">
                 <div>
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Vol / 24h</p>
                    <p className="text-xs font-mono text-slate-300">14.2M</p>
                 </div>
                 <div>
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Market Cap</p>
                    <p className="text-xs font-mono text-slate-300">2.4T</p>
                 </div>
                 <div>
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">P/E Ratio</p>
                    <p className="text-xs font-mono text-slate-300">32.4</p>
                 </div>
              </div>
            </div>
          </motion.div>
        ) : error ? (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-rose-500 font-mono text-xs uppercase tracking-widest mt-10">{error}</motion.p>
        ) : !loading && (
          <p className="text-center text-slate-600 font-mono text-[10px] uppercase tracking-[0.3em] mt-20 italic">Awaiting Ticker Input...</p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchTab;