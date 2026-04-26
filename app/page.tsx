'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { AppShell } from '@/components/AppShell';
import type { Track } from '@/lib/types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Trash2, 
  Grid2X2, 
  List, 
  RefreshCw, 
  Disc, 
  Activity,
  AlertCircle
} from 'lucide-react';

export default function Home() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  useEffect(() => {
    void fetchTracks();
  }, []);

  async function fetchTracks() {
    setLoading(true);
    try {
      const res = await fetch('/api/tracks');
      const data = await res.json();
      setTracks(data.tracks || []);
    } catch (err) {
      setError('Błąd podczas ładowania biblioteki');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell activeTrack={selectedTrack}>
      <div className="p-8">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-white">BIBLIOTEKA <span className="text-zinc-600">MASTER</span></h2>
            <p className="text-sm text-zinc-500 font-mono">TOTAL: {tracks.length} ASSETS READY</p>
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 bg-zinc-900 border technical-border px-4 py-2 rounded-lg text-xs font-bold text-zinc-400 hover:text-white transition-all">
              <Trash2 className="size-3" /> ANALIZA DUPLIKATÓW
            </button>
            <button className="flex items-center gap-2 bg-cyan-500 text-cyan-950 px-4 py-2 rounded-lg text-xs font-black shadow-lg shadow-cyan-500/20 hover:scale-105 transition-all">
              <Plus className="size-3" /> IMPORTUJ ŚCIEŻKI
            </button>
          </div>
        </header>

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6 bg-zinc-900/30 border technical-border p-2 rounded-xl backdrop-blur-sm">
          <div className="flex items-center gap-1">
             <ViewToggle 
                active={viewMode === 'list'} 
                onClick={() => setViewMode('list')} 
                icon={<List className="size-4" />}
             />
             <ViewToggle 
                active={viewMode === 'grid'} 
                onClick={() => setViewMode('grid')} 
                icon={<Grid2X2 className="size-4" />}
             />
          </div>

          <button 
            onClick={() => void fetchTracks()}
            className="p-2 text-zinc-500 hover:text-cyan-500 transition-colors"
          >
            <RefreshCw className={`size-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* List Content */}
        <div>
          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm">
              <AlertCircle className="size-5" /> {error}
            </div>
          )}

          {loading ? (
             <LoadingState />
          ) : tracks.length === 0 ? (
             <EmptyState />
          ) : (
            <div className={viewMode === 'list' ? 'space-y-1' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'}>
              <AnimatePresence>
                {tracks.map((track, i) => (
                  <TrackItem 
                    key={track.id} 
                    track={track} 
                    index={i}
                    viewMode={viewMode}
                    isSelected={selectedTrack?.id === track.id}
                    onClick={() => setSelectedTrack(track)}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}

function ViewToggle({ active, onClick, icon }: { active: boolean; onClick: () => void; icon: React.ReactNode }) {
  return (
    <button 
      onClick={onClick}
      className={`p-2 rounded-lg transition-all ${active ? 'bg-zinc-800 text-cyan-400 border technical-border' : 'text-zinc-600 hover:text-zinc-300'}`}
    >
      {icon}
    </button>
  );
}

function TrackItem({ track, index, viewMode, isSelected, onClick }: { track: Track; index: number; viewMode: 'grid' | 'list'; isSelected: boolean; onClick: () => void }) {
  const isList = viewMode === 'list';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.02, duration: 0.3 }}
      onClick={onClick}
      className={`
        group relative cursor-pointer border transition-all active:scale-[0.98]
        ${isList 
          ? 'flex items-center gap-4 p-3 rounded-lg' 
          : 'flex flex-col p-4 rounded-xl aspect-[4/5] justify-between'}
        ${isSelected 
          ? 'bg-cyan-500/5 border-cyan-500/50 shadow-lg shadow-cyan-500/5' 
          : 'bg-zinc-900/40 border-zinc-800/50 hover:bg-zinc-900/80 hover:border-zinc-700'}
      `}
    >
      {isSelected && (
        <motion.div 
          layoutId="selection-glow"
          className="absolute inset-0 rounded-[inherit] border border-cyan-500/30 blur-[2px] pointer-events-none"
        />
      )}

      <div className={`
        flex-shrink-0 bg-zinc-900 rounded-lg flex items-center justify-center border technical-border overflow-hidden relative
        ${isList ? 'size-12' : 'w-full aspect-square mb-2'}
      `}>
        <Disc className={`transition-all duration-700 ${isSelected ? 'text-cyan-400 rotate-[360deg] scale-110' : 'text-zinc-700 group-hover:text-zinc-500 group-hover:rotate-45'}`} />
        {isSelected && (
          <div className="absolute inset-0 flex items-center justify-center bg-cyan-500/10">
             <Activity className="size-6 text-cyan-500 animate-pulse" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-bold text-zinc-100 truncate flex items-center gap-2">
          {track.title}
          {track.format === 'FLAC' && <span className="text-[10px] font-black text-cyan-500/50">LOSSLESS</span>}
        </h4>
        <p className="text-xs text-zinc-500 truncate mt-0.5 uppercase tracking-wide">
          {track.artist}
        </p>
      </div>

      <div className={`flex items-center gap-3 ${isList ? '' : 'mt-auto pt-4 border-t technical-border'}`}>
        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-zinc-950 text-zinc-500 border technical-border">
          {track.key || 'N/A'}
        </span>
        <span className="text-[10px] font-mono font-black text-cyan-500/80">
          {track.bpm ? `${Math.round(track.bpm)}BPM` : '--BPM'}
        </span>
      </div>
    </motion.div>
  );
}

function LoadingState() {
  return (
    <div className="py-32 flex flex-col items-center justify-center">
      <div className="size-16 border-4 border-zinc-800 border-t-cyan-500 rounded-full animate-spin mb-4" />
      <p className="text-sm font-mono text-zinc-500">SYNCING CORE DATABASE...</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="py-32 flex flex-col items-center justify-center text-center">
      <Disc className="size-20 text-zinc-900 mb-6 stroke-1 animate-pulse" />
      <h3 className="text-lg font-bold text-zinc-100 mb-2">Pusta Biblioteka</h3>
      <p className="text-sm text-zinc-500 max-w-xs">Twoja biblioteka jest pusta. Zaimportuj utwory z lokalnego dysku lub folderów sieciowych.</p>
    </div>
  );
}
