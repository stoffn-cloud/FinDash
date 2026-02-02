import { useState, useMemo } from "react";
import {
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Percent,
  Activity,
  ShieldAlert,
  Search,
  RefreshCw,
  Globe,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import PerformanceChart from "./PerformanceChart";
import SectorChart from "./SectorChart";
import AssetAllocationTable from "./AssetAllocationTable";
import MarketsTab from "./MarketsTab";
import PortfolioEditor from "./PortfolioEditor";
import { cn } from "@/lib/utils";
import type { Portfolio, AssetClass } from "@/types/dashboard";

interface DashboardContentProps {
  portfolio: Portfolio;
  onAssetClick?: (asset: AssetClass) => void;
}

export default function DashboardContent({ portfolio, onAssetClick }: DashboardContentProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");

  const metrics = useMemo(() => [
    {
      label: "Totaal Vermogen",
      value: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact' }).format(portfolio.totalValue || 0),
      change: `+${portfolio.dailyChangePercent}%`,
      trend: "up",
      icon: DollarSign,
      description: "Huidige liquidatiewaarde"
    },
    {
      label: "YTD Rendement",
      value: `+${portfolio.ytdReturn}%`,
      change: "+8.45%",
      trend: "up",
      icon: ArrowUpRight,
      description: "Rendement sinds 1 jan"
    },
    {
      label: "Beta (β)",
      value: portfolio.riskMetrics?.beta?.toString() || "0.00",
      change: "+0.05",
      trend: "up",
      icon: Activity,
      description: "Marktgevoeligheid"
    },
    {
      label: "Max Drawdown",
      value: `${portfolio.riskMetrics?.maxDrawdown}%`,
      change: "-12.4%",
      trend: "down",
      icon: ShieldAlert,
      description: "Grootste daling piek-dal"
    }
  ], [portfolio]);

  const filteredAssetClasses = useMemo(() => {
    const assets = portfolio.assetClasses || [];
    if (!searchQuery) return assets;
    return assets.filter(asset =>
      asset.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [portfolio.assetClasses, searchQuery]);

  return (
    <div className="space-y-8">
      {/* Header with Search and Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input
            placeholder="Zoek in portfolio..."
            className="pl-10 bg-slate-900/50 border-slate-800 text-slate-200 focus:ring-blue-500/20"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="bg-slate-900/50 border-slate-800 text-slate-300">
            <RefreshCw className="w-4 h-4 mr-2" /> Sync
          </Button>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-500 text-white">
            <Plus className="w-4 h-4 mr-2" /> Asset Toevoegen
          </Button>
        </div>
      </div>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, i) => (
          <Card key={i} className="bg-slate-900/40 border-slate-800 backdrop-blur-sm overflow-hidden group">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                  <metric.icon className="w-5 h-5 text-blue-400" />
                </div>
                <Badge variant="outline" className={cn(
                  "font-mono text-[10px]",
                  metric.trend === "up" ? "text-emerald-400 border-emerald-500/20 bg-emerald-500/5" : "text-rose-400 border-rose-500/20 bg-rose-500/5"
                )}>
                  {metric.trend === "up" ? "↑" : "↓"} {metric.change}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{metric.label}</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-bold text-white tracking-tight">{metric.value}</h3>
                </div>
                <p className="text-[10px] text-slate-600">{metric.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-6" onValueChange={setActiveTab}>
        <div className="flex justify-center">
          <TabsList className="bg-slate-900/80 border border-slate-800 p-1 h-12">
            <TabsTrigger value="overview" className="px-6 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              OVERVIEW
            </TabsTrigger>
            <TabsTrigger value="assets" className="px-6 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              ASSET CLASSES
            </TabsTrigger>
            <TabsTrigger value="markets" className="px-6 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              MARKETS
            </TabsTrigger>
            <TabsTrigger value="editor" className="px-6 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              EDITOR
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-6 focus-visible:outline-none focus-visible:ring-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 bg-slate-900/40 border-slate-800">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-white">Performance vs Markt</CardTitle>
                  <CardDescription className="text-slate-500">Cumulatief Rendement (%)</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                    ALPHA +4.2%
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="h-[350px]">
                <PerformanceChart data={portfolio.performanceHistory || []} />
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="bg-slate-900/40 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white text-sm">Portfolio Beta</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <span className="text-3xl font-bold text-white">{portfolio.riskMetrics?.beta}</span>
                      <span className="text-xs text-amber-400 font-medium">GEMIDDELD RISICO</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: '42.5%' }} />
                    </div>
                    <p className="text-[10px] text-slate-500 italic">
                      β &gt; 1: Beweeglijker dan de markt. β &lt; 1: Defensiever dan de markt.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/40 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white text-sm">Jaarlijkse Volatiliteit</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <span className="text-3xl font-bold text-white">{portfolio.riskMetrics?.volatility}%</span>
                      <span className="text-xs text-emerald-400 font-medium">LAAG RISICO</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: '30.4%' }} />
                    </div>
                    <p className="text-[10px] text-slate-500 italic">
                      De spreiding van rendementen. Hoe lager, hoe stabieler de groei.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             <AssetAllocationTable
              assetClasses={filteredAssetClasses}
              onAssetClick={onAssetClick}
            />
            <SectorChart sectors={portfolio.sectorAllocation || []} />
          </div>

          <Card className="bg-slate-900/40 border-slate-800">
            <CardHeader className="flex flex-row items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Globe className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-white">Geografische Spreiding</CardTitle>
                <CardDescription className="text-slate-500">Exposure per regio</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { region: "North America", weight: 65.4, color: "bg-blue-500" },
                  { region: "Europe", weight: 18.2, color: "bg-emerald-500" },
                  { region: "Emerging Markets", weight: 12.5, color: "bg-amber-500" }
                ].map((reg, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-300 font-medium">{reg.region}</span>
                      <span className="text-white font-mono">{reg.weight}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className={cn("h-full rounded-full", reg.color)} style={{ width: `${reg.weight}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assets" className="focus-visible:outline-none focus-visible:ring-0">
          <AssetAllocationTable
            assetClasses={filteredAssetClasses}
            onAssetClick={onAssetClick}
          />
        </TabsContent>

        <TabsContent value="markets" className="focus-visible:outline-none focus-visible:ring-0">
          <MarketsTab />
        </TabsContent>

        <TabsContent value="editor" className="focus-visible:outline-none focus-visible:ring-0">
          <PortfolioEditor />
        </TabsContent>
      </Tabs>
    </div>
  );
}