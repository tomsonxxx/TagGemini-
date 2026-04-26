import Link from 'next/link';
import { AlertTriangle, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-4 font-sans">
      <div className="size-20 bg-red-500/10 rounded-2xl flex items-center justify-center border border-red-500/20 mb-8">
        <AlertTriangle className="size-10 text-red-500" />
      </div>
      <h2 className="text-4xl font-black mb-4 tracking-tighter uppercase italic">
        ERR: <span className="text-zinc-600">404</span>_NOT_FOUND
      </h2>
      <p className="text-zinc-500 mb-8 font-mono text-sm max-w-xs text-center border-l-2 border-zinc-800 pl-4 py-2">
        Żądany zasób nie figuruje w indeksie systemowym Phonic Carbon. Sprawdź poprawność ścieżki.
      </p>
      <Link 
        href="/" 
        className="flex items-center gap-2 px-8 py-3 bg-cyan-500 text-cyan-950 rounded-xl font-black transition-all hover:scale-105 active:scale-95 shadow-lg shadow-cyan-500/20"
      >
        <Home className="size-4" /> REBOOT_TO_LIBRARY
      </Link>
    </div>
  );
}
