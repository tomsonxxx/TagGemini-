'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Library, 
  Search, 
  Settings, 
  FolderOpen, 
  Layers, 
  Zap, 
  ChevronLeft, 
  ChevronRight,
  Disc,
  Play,
  SkipForward,
  SkipBack,
  Volume2,
  Mic2,
  Cpu,
  Hash
} from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
  sidebarLeft?: React.ReactNode;
  sidebarRight?: React.ReactNode;
  activeTrack?: any;
}

export function AppShell({ children, sidebarLeft, sidebarRight, activeTrack }: AppShellProps) {
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen w-full bg-zinc-950 overflow-hidden font-sans">
      {/* Sidebar LEWY - Nawigacja / Foldery */}
      <AnimatePresence mode="wait">
        {isLeftSidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="flex-shrink-0 glass-panel z-20 flex flex-col"
          >
            <div className="p-6 flex items-center gap-3">
              <div className="size-8 bg-cyan-500 rounded flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.4)]">
                <Zap className="size-5 text-cyan-950 fill-cyan-950" />
              </div>
              <h1 className="font-black tracking-tighter text-xl text-zinc-100">PHONIC<span className="text-cyan-500">CARBON</span></h1>
            </div>

            <nav className="flex-1 px-4 space-y-1 mt-4">
              <NavButton icon={<Library className="size-4" />} label="Biblioteka" active />
              <NavButton icon={<FolderOpen className="size-4" />} label="Eksplorator" />
              <NavButton icon={<Layers className="size-4" />} label="Playlisty" />
              <NavButton icon={<Hash className="size-4" />} label="Tagi AI" />
            </nav>

            <div className="p-4 border-t technical-border">
              <div className="bg-zinc-900/50 rounded-lg p-3 border technical-border">
                <div className="flex items-center gap-2 mb-2">
                  <Cpu className="size-3 text-cyan-500" />
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">System Status</span>
                </div>
                <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '45%' }}
                    className="h-full bg-cyan-500"
                  />
                </div>
                <span className="text-[10px] font-mono text-zinc-600 mt-1 block">BUFFER: 44.1kHz / 256ms</span>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* GŁÓWNY PANEL */}
      <main className="flex-1 relative flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 border-b technical-border flex items-center justify-between px-6 bg-zinc-950/50 backdrop-blur-md z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
              className="p-1.5 hover:bg-zinc-800 rounded transition-colors text-zinc-500"
            >
              {isLeftSidebarOpen ? <ChevronLeft className="size-4" /> : <ChevronRight className="size-4" />}
            </button>
            <div className="h-4 w-px bg-zinc-800" />
            <div className="flex items-center gap-2 text-zinc-500 text-xs font-medium">
              <span className="hover:text-zinc-200 cursor-pointer">Moja Muzyka</span>
              <span className="text-zinc-700">/</span>
              <span className="text-zinc-200">Wszystkie Utwory</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-600 group-focus-within:text-cyan-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Szukaj utworu... (⌘+F)" 
                className="bg-zinc-900/50 border technical-border rounded-full py-1.5 pl-10 pr-4 text-xs w-64 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all"
              />
            </div>
            <button className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400">
              <Settings className="size-4" />
            </button>
          </div>
        </header>

        {/* Content View */}
        <div className="flex-1 overflow-auto custom-scrollbar">
          {children}
        </div>

        {/* DOLNY PLAYER */}
        <footer className="h-24 glass-panel border-t technical-border px-6 flex items-center justify-between z-30">
          <div className="flex items-center gap-4 w-1/4 min-w-0">
            <div className="size-14 bg-zinc-900 rounded-lg flex items-center justify-center border technical-border relative overflow-hidden group">
               {activeTrack ? (
                 <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-zinc-950 animate-pulse" />
               ) : (
                 <Disc className="size-6 text-zinc-700" />
               )}
            </div>
            <div className="min-w-0 flex flex-col justify-center">
              <h4 className="text-sm font-bold text-zinc-100 truncate">
                {activeTrack?.title || 'Wybierz utwór'}
              </h4>
              <p className="text-xs text-zinc-500 truncate">
                {activeTrack?.artist || 'Nieznany wykonawca'}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2 max-w-lg w-full px-4">
            <div className="flex items-center gap-6">
              <button className="text-zinc-500 hover:text-zinc-100 transition-colors"><SkipBack className="size-5" /></button>
              <button className="size-10 bg-zinc-100 text-zinc-950 rounded-full flex items-center justify-center hover:bg-cyan-500 hover:text-cyan-950 transition-all active:scale-95 shadow-lg shadow-cyan-500/10">
                <Play className="size-5 fill-current ml-0.5" />
              </button>
              <button className="text-zinc-500 hover:text-zinc-100 transition-colors"><SkipForward className="size-5" /></button>
            </div>
            <div className="w-full flex items-center gap-3">
              <span className="text-[10px] font-mono text-zinc-500">02:45</span>
              <div className="flex-1 h-1 bg-zinc-800 rounded-full relative group cursor-pointer">
                <div className="absolute inset-0 bg-cyan-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                <motion.div 
                   className="h-full bg-cyan-500 rounded-full relative"
                   animate={{ width: '45%' }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 size-2.5 bg-zinc-100 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              </div>
              <span className="text-[10px] font-mono text-zinc-500">06:12</span>
            </div>
          </div>

          <div className="w-1/4 flex items-center justify-end gap-4 text-zinc-500">
            <div className="flex items-center gap-2 text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-500 px-2 py-1 rounded border border-cyan-500/20">
              124.5 BPM
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono font-bold bg-zinc-800 text-zinc-300 px-2 py-1 rounded border border-zinc-700">
              8A
            </div>
            <div className="flex items-center gap-2 group">
              <Volume2 className="size-4 group-hover:text-zinc-200 transition-colors" />
              <div className="w-24 h-1 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-zinc-500 w-3/4" />
              </div>
            </div>
          </div>
        </footer>
      </main>

      {/* INSPEKTOR PRAWY */}
      <AnimatePresence>
        {isRightSidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 340, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="flex-shrink-0 glass-panel relative flex flex-col border-l technical-border border-r-0"
          >
             <div className="p-4 border-b technical-border flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Muzyczny Inspector</h3>
                <button 
                  onClick={() => setIsRightSidebarOpen(false)}
                  className="p-1 hover:bg-zinc-800 rounded transition-colors text-zinc-500"
                >
                  <ChevronRight className="size-4" />
                </button>
             </div>
             <div className="flex-1 overflow-auto p-6 custom-scrollbar space-y-8">
               {activeTrack ? (
                 <TrackDetails track={activeTrack} />
               ) : (
                 <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                    <Mic2 className="size-12 mb-4 stroke-1" />
                    <p className="text-sm">Wybierz utwór,<br/>aby zobaczyć szczegóły</p>
                 </div>
               )}
             </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {!isRightSidebarOpen && (
        <button 
          onClick={() => setIsRightSidebarOpen(true)}
          className="absolute right-0 top-1/2 -translate-y-1/2 h-20 w-8 bg-zinc-900 border-l technical-border rounded-l-xl flex items-center justify-center text-zinc-500 hover:text-cyan-500 transition-all z-40"
        >
          <ChevronLeft className="size-4" />
        </button>
      )}
    </div>
  );
}

function NavButton({ icon, label, active = false }: { icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <button className={`
      w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all group
      ${active 
        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' 
        : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900/50 border border-transparent'}
    `}>
      <span className={active ? 'text-cyan-400' : 'text-zinc-500 group-hover:text-cyan-500 transition-colors'}>{icon}</span>
      {label}
      {active && <motion.div layoutId="nav-glow" className="absolute right-6 w-1 h-4 bg-cyan-500 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)]" />}
    </button>
  );
}

function TrackDetails({ track }: { track: any }) {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="aspect-square w-full bg-zinc-900 rounded-2xl border technical-border mb-6 flex items-center justify-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-60" />
        <Disc className="size-16 text-zinc-800" />
        <div className="absolute bottom-4 left-4 right-4">
          <div className="text-[10px] font-mono text-cyan-500 mb-1">PROGRESIVE HOUSE</div>
          <h2 className="text-xl font-black text-white leading-tight">{track.title}</h2>
        </div>
      </div>

      <div className="space-y-6">
        <section>
          <h5 className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.2em] mb-3">Analiza AI</h5>
          <div className="grid grid-cols-2 gap-2">
            <AnalysisCard label="Energia" value="BARDZO WYSOKA" color="cyan" />
            <AnalysisCard label="Nastroj" value="ENERGETYCZNY" color="cyan" />
          </div>
        </section>

        <section>
          <h5 className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.2em] mb-3">Dane ID3</h5>
          <div className="space-y-2">
            <DataRow label="Artysta" value={track.artist} />
            <DataRow label="Album" value={track.album || '-'} />
            <DataRow label="BPM" value={`${track.bpm || '0'} BPM`} />
            <DataRow label="Klucz" value={track.key || '-'} />
            <DataRow label="Format" value={track.format || '-'} />
          </div>
        </section>
      </div>
    </div>
  );
}

function AnalysisCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="p-3 bg-zinc-900/50 rounded-xl border technical-border">
      <div className="text-[9px] font-bold text-zinc-600 uppercase mb-1">{label}</div>
      <div className="text-[10px] font-mono font-black text-cyan-400 truncate">{value}</div>
    </div>
  );
}

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b technical-border last:border-0 border-dashed">
      <span className="text-xs text-zinc-500">{label}</span>
      <span className="text-xs font-mono text-zinc-200">{value}</span>
    </div>
  );
}
