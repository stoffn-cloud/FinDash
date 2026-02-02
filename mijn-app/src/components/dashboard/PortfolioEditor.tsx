import React, { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Save,
  RefreshCcw,
  PlusCircle,
  Layout
} from "lucide-react";
import { usePortfolio } from "@/api/portfolioStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

export default function PortfolioEditor() {
  const { portfolio, updateHoldings, fetchLivePrices } = usePortfolio();
  const [selectedAssetClassId, setSelectedAssetClassId] = useState<string>(portfolio.assetClasses?.[0]?.id || "");
  const [holdings, setHoldings] = useState(portfolio.assetClasses?.[0]?.holdings || []);

  useEffect(() => {
    const ac = portfolio.assetClasses?.find(a => a.id === selectedAssetClassId);
    if (ac) {
      setHoldings(ac.holdings || []);
    }
  }, [portfolio, selectedAssetClassId]);

  const handleAssetClassChange = (id: string) => {
    setSelectedAssetClassId(id);
    const ac = portfolio.assetClasses?.find(a => a.id === id);
    setHoldings(ac?.holdings || []);
  };

  const handleHoldingChange = (index: number, field: string, value: string | number) => {
    const newHoldings = [...holdings];
    newHoldings[index] = { ...newHoldings[index], [field]: value };
    setHoldings(newHoldings);
  };

  const addHolding = () => {
    setHoldings([...holdings, { name: "New Asset", ticker: "", weight: 0, value: 0, return_ytd: 0 }]);
  };

  const removeHolding = (index: number) => {
    setHoldings(holdings.filter((_, i) => i !== index));
  };

  const saveChanges = () => {
    updateHoldings(selectedAssetClassId, holdings);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Layout className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Portfolio Editor</h2>
            <p className="text-slate-500 text-[10px] uppercase tracking-widest mt-0.5">Beheer uw Quantum Alpha holdings</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <Button
            variant="outline"
            size="sm"
            onClick={() => fetchLivePrices()}
            className="bg-slate-900 border-slate-800 text-slate-400 hover:text-white h-9 px-4"
          >
            <RefreshCcw className="w-3.5 h-3.5 mr-2" /> Sync Prijzen
          </Button>
          <Button
            size="sm"
            onClick={saveChanges}
            className="bg-blue-600 hover:bg-blue-500 text-white h-9 px-4"
          >
            <Save className="w-3.5 h-3.5 mr-2" /> Wijzigingen Opslaan
          </Button>
        </div>
      </div>

      <Card className="bg-slate-900/40 border-slate-800 backdrop-blur-xl rounded-3xl overflow-hidden">
        <CardHeader className="border-b border-slate-800/50 bg-slate-950/20 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <CardTitle className="text-white text-base">Categorie Selectie</CardTitle>
              <CardDescription className="text-slate-500 text-[10px] font-mono uppercase tracking-tight">
                Bewerk holdings per asset class protocol
              </CardDescription>
            </div>
            <Select value={selectedAssetClassId} onValueChange={handleAssetClassChange}>
              <SelectTrigger className="w-full sm:w-64 bg-slate-950 border-slate-800 text-white rounded-xl">
                <SelectValue placeholder="Kies categorie..." />
              </SelectTrigger>
              <SelectContent className="bg-slate-950 border-slate-800 text-white rounded-xl">
                {portfolio.assetClasses?.map(ac => (
                  <SelectItem key={ac.id} value={ac.id!}>{ac.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-950/40">
                <TableRow className="border-slate-800 hover:bg-transparent">
                  <TableHead className="text-[10px] font-bold text-slate-500 uppercase py-4">Asset Naam</TableHead>
                  <TableHead className="text-[10px] font-bold text-slate-500 uppercase py-4">Ticker</TableHead>
                  <TableHead className="text-[10px] font-bold text-slate-500 uppercase text-right py-4">Aantal Units</TableHead>
                  <TableHead className="w-16"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {holdings.map((holding, index) => (
                  <TableRow key={index} className="border-slate-800/50 hover:bg-slate-800/20 transition-colors group">
                    <TableCell className="py-4">
                      <Input
                        value={holding.name}
                        onChange={(e) => handleHoldingChange(index, "name", e.target.value)}
                        className="bg-transparent border-none text-slate-200 focus:ring-0 p-0 h-auto font-medium focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </TableCell>
                    <TableCell className="py-4">
                      <Input
                        value={holding.ticker}
                        onChange={(e) => handleHoldingChange(index, "ticker", e.target.value.toUpperCase())}
                        className="bg-transparent border-none text-blue-400 font-mono focus:ring-0 p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </TableCell>
                    <TableCell className="text-right py-4">
                      <Input
                        type="number"
                        value={(holding as any).quantity || 100}
                        onChange={(e) => handleHoldingChange(index, "quantity", Number(e.target.value))}
                        className="bg-transparent border-none text-right text-slate-200 focus:ring-0 p-0 h-auto font-mono focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </TableCell>
                    <TableCell className="py-4 text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeHolding(index)}
                        className="h-8 w-8 text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="p-6 border-t border-slate-800/50 flex justify-center bg-slate-950/10">
            <Button
              variant="ghost"
              size="sm"
              onClick={addHolding}
              className="text-slate-500 hover:text-blue-400 transition-all hover:bg-blue-500/5 px-6 rounded-xl border border-dashed border-slate-800 hover:border-blue-500/30"
            >
              <PlusCircle className="w-3.5 h-3.5 mr-2" /> Nieuwe Asset Toevoegen
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-3xl">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <p className="text-[10px] text-emerald-500 font-mono uppercase tracking-[0.2em]">Live Synchronization Protocol</p>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">
          Wijzigingen worden direct doorgevoerd in de berekeningen van het dashboard zodra u op 'Opslaan' klikt.
          Gebruik 'Sync Prijzen' om de laatste marktdata op te halen voor alle tickers in uw portfolio via de Quantum Alpha API.
        </p>
      </div>
    </div>
  );
}
