import { ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-900 bg-black/40 py-8">
      <div className="max-w-[1600px] mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-slate-800 rounded flex items-center justify-center">
            <ShieldCheck className="w-3 h-3 text-slate-400" />
          </div>
          <span className="text-xs text-slate-500">© 2024 Quantum Alpha Portfolio. Secured by End-to-End Encryption.</span>
        </div>
        <div className="flex gap-6">
          <a href="#" className="text-xs text-slate-600 hover:text-slate-400">Documentation</a>
          <a href="#" className="text-xs text-slate-600 hover:text-slate-400">API Status</a>
        </div>
      </div>
    </footer>
  );
}