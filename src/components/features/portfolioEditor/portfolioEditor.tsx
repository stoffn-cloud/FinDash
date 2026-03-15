"use client";

import React, { useState, useMemo } from "react";
import { Plus, Save, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addUserHolding, deleteUserHolding } from "@/lib/api/actions"; 
import type { Portfolio, EnrichedHolding } from "@/types"; 
import { ExistingHoldingRow } from "./existiongHoldingRow"; 
import { NewTransactionRow } from "./newTransactionRow";
import { usePortfolioStore } from "@/store/enrichedData/useSnapshotPortfolioStore";

interface PortfolioEditorProps {
  portfolio: Portfolio;
  onSuccess?: () => void;
}

export default function PortfolioEditor({ portfolio, onSuccess }: PortfolioEditorProps) {
  const storePortfolio = usePortfolioStore((state) => state.portfolio);
  
  const availableAssets = useMemo(() => {
    return storePortfolio?.enrichedAssets || portfolio?.enrichedAssets || [];
  }, [portfolio?.enrichedAssets, storePortfolio?.enrichedAssets]);

  // Sortering strikt op purchase_date (snake_case)
  const latestDbHoldings = useMemo(() => {
    const holdings: EnrichedHolding[] = portfolio.holdings || [];
    return [...holdings]
      .sort((a, b) => {
        // Gebruik de Date constructor veilig met de snake_case velden
        const dateA = new Date(a.purchase_date).getTime();
        const dateB = new Date(b.purchase_date).getTime();
        return dateB - dateA;
      })
      .slice(0, 3); 
  }, [portfolio.holdings]);

  const isDemoMode = portfolio.name === "Demo Portfolio";
  
  // State geïnitialiseerd met snake_case om te matchen met EnrichedHolding types
  const [newHolding, setNewHolding] = useState({ 
    ticker_id: 0, 
    quantity: 0, 
    purchase_price: 0, 
    purchase_date: new Date().toISOString().split('T')[0] 
  });

  const [isSaving, setIsSaving] = useState(false);

  // Update functie die de snake_case keys verwacht van de NewTransactionRow
  const updateRow = (_index: number, field: string, value: any) => {
    setNewHolding((prev) => ({ ...prev, [field]: value }));
  };

  const handleCommit = async () => {
    const qty = Number(newHolding.quantity);
    const price = Number(newHolding.purchase_price);

    // Validatie op basis van snake_case keys
    if (!newHolding.ticker_id || newHolding.ticker_id === 0 || qty <= 0 || price <= 0) {
      alert("⚠️ Vul een geldig instrument, prijs en hoeveelheid in.");
      return;
    }

    setIsSaving(true);
    try {
      // Directe doorgeef van snake_case naar de Server Action
      await addUserHolding({
        ticker_id: Number(newHolding.ticker_id),
        price: price,
        amount: qty,
        purchase_date: newHolding.purchase_date,
      });
      
      // Reset naar schone snake_case state
      setNewHolding({
        ticker_id: 0, 
        quantity: 0, 
        purchase_price: 0, 
        purchase_date: new Date().toISOString().split('T')[0] 
      });

      if (onSuccess) onSuccess(); 
    } catch (err) {
      console.error("❌ MySQL Save Error:", err);
      alert("Er ging iets mis bij het opslaan.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteExisting = async (id: number) => {
    if (!id) return;
    if (confirm("Weet je zeker dat je deze transactie wilt verwijderen?")) {
      try {
        await deleteUserHolding(id);
        if (onSuccess) onSuccess();
      } catch (err) {
        console.error("Delete error:", err);
      }
    }
  };

  return (
    <div className="bg-slate-900/40 border border-slate-800 rounded-[2rem] overflow-hidden backdrop-blur-md">
      {/* ADD HOLDING SECTION */}
      <div className="p-8 bg-emerald-500/[0.01]">
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <Plus className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-white font-bold uppercase tracking-tighter text-sm">Add Holding</h3>
              <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest leading-none mt-1">
                Enter your new transaction details
              </p>
            </div>
          </div>
        </header>

        <div className="space-y-3">
          <NewTransactionRow 
            index={0} 
            row={newHolding} 
            availableAssets={availableAssets} 
            onUpdate={updateRow} 
            onRemove={() => {}} 
          />
        </div>

        {newHolding.ticker_id !== 0 && (
          <div className="mt-6 flex justify-end">
            <Button 
              onClick={handleCommit} 
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-6 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 transition-all active:scale-95"
            >
              {isSaving ? "Syncing..." : <><Save className="w-4 h-4 mr-2" /> Sync with Database</>}
            </Button>
          </div>
        )}
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent" />

      {/* LATEST ACTIVITY SECTION */}
      <div className="p-8">
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <History className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-white font-bold uppercase tracking-tighter text-sm">Latest Activity</h3>
              <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest leading-none mt-1">
                Last 3 entries in SQL
              </p>
            </div>
          </div>
        </header>

        <div className="space-y-2">
          {latestDbHoldings.length > 0 ? (
            latestDbHoldings.map((holding, idx) => (
              <ExistingHoldingRow 
                key={holding.id || `latest-${idx}`} 
                holding={holding} 
                availableAssets={availableAssets}
                isDemoMode={isDemoMode} 
                onDelete={handleDeleteExisting} 
              />
            ))
          ) : (
            <div className="text-center py-10 border border-dashed border-white/5 rounded-[2rem]">
              <p className="text-slate-600 text-[10px] font-mono uppercase tracking-widest">No transactions found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}