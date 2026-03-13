"use client";

import React, { useState } from "react";
import { Trash2, AlertTriangle, RefreshCcw, Database, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { resetToDemo } from "@/lib/api/actions"; // Dit haalt de functie uit het andere bestand

export default function SettingsTab() {
  const [isResetting, setIsResetting] = useState(false);

  const handleFullReset = async () => {
    const confirmed = confirm(
      "WAARSCHUWING: Dit wist AL je eigen transacties uit de database. Wil je doorgaan?"
    );

    if (confirmed) {
      setIsResetting(true);
      try {
        const res = await resetToDemo();
        if (res?.success) {
          alert("Database succesvol geleegd.");
          window.location.reload();
        } else {
          alert("Er ging iets mis bij het legen van de database.");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsResetting(false);
      }
    }
  };

  return (
    // ... de rest van je JSX blijft hetzelfde ...
    <div className="max-w-4xl mx-auto space-y-8">
       {/* ... rest van de code ... */}
       <Button onClick={handleFullReset} disabled={isResetting}>
          {isResetting ? "Resetting..." : "Reset to Demo"}
       </Button>
    </div>
  );
}