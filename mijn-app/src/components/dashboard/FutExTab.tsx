import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrendingUp, Target } from "lucide-react";

// 1. Definieer de interface voor de Props om alle 'any' errors op te lossen
interface FutExTabProps {
  assets: any[];
  inputs: Record<string, number>; // De state uit Dashboard
  onInputChange: (newInputs: Record<string, number>) => void; // De setter uit Dashboard
}

export default function FutExTab({ assets, inputs, onInputChange }: FutExTabProps) {
  // 2. Type-safe ophalen van asset classes
  const assetClasses: string[] = Array.from(new Set(assets.map((a: any) => a.assetClass)));

  const handleInputChange = (className: string, value: string) => {
    // We zetten de string uit het tekstveld om naar een getal
    const numValue = parseFloat(value) || 0;
    onInputChange({
      ...inputs,
      [className]: numValue
    });
  };

  // Berekening voor de statistiek onderaan
  const inputValues = Object.values(inputs);
  const averageReturn = inputValues.length > 0 
    ? inputValues.reduce((a, b) => a + b, 0) / inputValues.length 
    : 0;

  return (
    <div className="p-6 space-y-6">
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-400" />
            <CardTitle className="text-white">Future Expectations (Ex-Ante)</CardTitle>
          </div>
          <CardDescription className="text-slate-400">
            Vul hier je eigen rendementsverwachtingen per activaklasse in.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="border-slate-800">
              <TableRow className="hover:bg-transparent border-slate-800">
                <TableHead className="text-slate-400">Asset Class</TableHead>
                <TableHead className="w-[200px] text-slate-400">Verwacht Rendement (%)</TableHead>
                <TableHead className="text-slate-400">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assetClasses.map((className) => (
                <TableRow key={className} className="border-slate-800 hover:bg-slate-800/30">
                  <TableCell className="font-medium text-slate-200">{className}</TableCell>
                  <TableCell>
                    <div className="relative">
                      <Input
                        type="number"
                        step="0.1"
                        value={inputs[className] ?? ""}
                        onChange={(e) => handleInputChange(className, e.target.value)}
                        className="bg-slate-950 border-slate-700 text-white pr-8 focus:ring-blue-500"
                      />
                      <span className="absolute right-3 top-2.5 text-slate-500 text-sm">%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {(inputs[className] ?? 0) > 10 ? (
                      <span className="text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded uppercase tracking-wider">
                        High Growth
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold bg-slate-800 text-slate-400 px-2 py-0.5 rounded uppercase tracking-wider">
                        Moderate
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-blue-600/5 border-blue-600/20">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-2">
              <TrendingUp className="h-8 w-8 text-blue-500" />
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Ingevoerde Consensus</p>
              <p className="text-3xl font-black text-white italic">
                {averageReturn.toFixed(2)}%
              </p>
              <p className="text-[10px] text-slate-500 italic uppercase">Ongecorrigeerd gemiddelde</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}