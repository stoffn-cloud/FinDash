import React from 'react';
import { ShieldAlert, LogOut, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const UserNotRegisteredError = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-slate-200 p-4">
      {/* Aurora Glow Effect op de achtergrond */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-md w-full p-8 bg-slate-900/40 backdrop-blur-2xl rounded-3xl border border-slate-800 shadow-2xl relative">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-2xl bg-orange-500/10 border border-orange-500/20 shadow-[0_0_20px_rgba(249,115,22,0.1)]">
            <ShieldAlert className="w-10 h-10 text-orange-500" />
          </div>

          <h1 className="text-2xl font-black uppercase tracking-[0.2em] text-white mb-2">
            Access Denied
          </h1>
          <p className="text-[11px] font-mono text-slate-500 uppercase tracking-widest mb-8">
            Protocol Error: USER_NOT_REGISTERED
          </p>

          <div className="p-5 bg-slate-950/50 rounded-2xl border border-slate-800/50 text-left mb-8">
            <p className="text-sm text-slate-400 mb-4 leading-relaxed">
              Uw account is momenteel niet geautoriseerd voor dit platform. Neem contact op met de systeembeheerder om uw identiteit te verifiëren en toegang te verlenen.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-xs font-mono text-slate-500">
                <div className="w-1 h-1 rounded-full bg-blue-500 shadow-[0_0_5px_#3b82f6]" />
                Check uw login gegevens
              </div>
              <div className="flex items-center gap-3 text-xs font-mono text-slate-500">
                <div className="w-1 h-1 rounded-full bg-blue-500 shadow-[0_0_5px_#3b82f6]" />
                Verifieer uw organisatie-domein
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="border-slate-800 hover:bg-slate-800 text-[10px] font-black uppercase tracking-widest"
              onClick={() => window.location.href = 'mailto:admin@aurora-fintech.com'}
            >
              <Mail className="mr-2 h-3 w-3" /> Admin
            </Button>
            <Button 
              className="bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest shadow-[0_0_15px_rgba(59,130,246,0.3)]"
              onClick={() => console.log("Logout logic here")}
            >
              <LogOut className="mr-2 h-3 w-3" /> Logout
            </Button>
          </div>
        </div>
      </div>
      
      <p className="mt-8 text-[10px] font-mono text-slate-700 uppercase tracking-[0.3em]">
        Aurora Security Protocol v2.4.0
      </p>
    </div>
  );
};

export default UserNotRegisteredError;

