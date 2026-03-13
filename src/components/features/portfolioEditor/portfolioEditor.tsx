"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Plus, Save, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addUserHolding, deleteUserHolding } from "@/lib/api/actions"; 
import type { Portfolio } from "@/types";
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

  const latestDbHoldings = useMemo(() => {
    const holdings = portfolio.holdings || [];
    return [...holdings]
      .sort((a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime())
      .slice(0, 3); 
  }, [portfolio.holdings]);

  const isDemoMode = portfolio.name === "Demo Portfolio";
  
  // We forceren nu één rij in de state
  const [newHolding, setNewHolding] = useState<any>({ 
    tempId: crypto.randomUUID(),
    ticker_id: 0, 
    quantity: 0, 
    purchasePrice: 0, 
    purchaseDate: new Date().toISOString().split('T')[0] 
  });

  const [isSaving, setIsSaving] = useState(false);

  const updateRow = (_index: number, field: string, value: any) => {
    setNewHolding((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleCommit = async () => {
    if (newHolding.ticker_id === 0 || newHolding.quantity <= 0) {
      alert("⚠️ Selecteer een instrument en vul een geldige hoeveelheid in.");
      return;
    }

    setIsSaving(true);
    try {
      await addUserHolding({
        ticker_id: Number(newHolding.ticker_id),
        price: Number(newHolding.purchasePrice),
        amount: Number(newHolding.quantity),
        purchase_date: newHolding.purchaseDate,
      });
      
      // Reset de rij naar leeg na succes
      setNewHolding({
        tempId: crypto.randomUUID(),
        ticker_id: 0, 
        quantity: 0, 
        purchasePrice: 0, 
        purchaseDate: new Date().toISOString().split('T')[0] 
      });

      if (onSuccess) onSuccess(); 
    } catch (err) {
      console.error("MySQL Save Error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteExisting = async (id: number) => {
    if (!id) return;
    if (confirm("Weet je zeker dat je deze transactie wilt verwijderen uit de database?")) {
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
      <div className="p-8 bg-emerald-500/[0.01]">
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <Plus className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              {/* Naam aangepast naar Add Holding */}
              <h3 className="text-white font-bold uppercase tracking-tighter text-sm">Add Holding</h3>
              <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest leading-none mt-1">
                Enter your new transaction details
              </p>
            </div>
          </div>
        </header>

        <div className="space-y-3">
          {/* We tonen nu direct de NewTransactionRow zonder map, omdat er maar één is */}
          <NewTransactionRow 
            index={0} 
            row={newHolding} 
            availableAssets={availableAssets} 
            onUpdate={updateRow} 
            onRemove={() => {}} // Verwijderen niet nodig bij 1 rij
          />
        </div>

        {newHolding.ticker_id !== 0 && (
          <div className="mt-6 flex justify-end">
            <Button 
              onClick={handleCommit} 
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-6 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 transition-all"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Syncing..." : "Sync with Database"}
            </Button>
          </div>
        )}
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent" />

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
            latestDbHoldings.map((holding) => (
              <ExistingHoldingRow 
                key={holding.id} 
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