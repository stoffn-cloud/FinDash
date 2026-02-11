import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { portfolioStore } from '../store/portfolioStore';

const SearchTab = () => {
  const [ticker, setTicker] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticker) return;

    setLoading(true);
    // We roepen een functie aan in de store die de NASDAQ sheet doorzoekt
    const data = await portfolioStore.searchInSheet('Equities:NASDAQ', ticker.toUpperCase());
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Ticker Search (NASDAQ)</h1>
      
      <form onSubmit={handleSearch} className="flex gap-2 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            placeholder="Bijv. AAPL, NVDA, TSLA..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <button 
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          Zoek Prijs
        </button>
      </form>

      {result ? (
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold">{result.ticker}</h2>
              <p className="text-gray-500">{result.name || 'NASDAQ Listing'}</p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-mono font-bold">${result.price}</p>
              <p className={`text-sm ${result.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {result.change}% (Vandaag)
              </p>
            </div>
          </div>
        </div>
      ) : !loading && (
        <p className="text-center text-gray-400 mt-10">Voer een ticker in om de NASDAQ data te doorzoeken.</p>
      )}
    </div>
  );
};

export default SearchTab;