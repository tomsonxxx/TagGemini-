'use client';

import React from 'react';
import type { Track } from '@/lib/types';
import { X, Disc, Music, Clock, Activity, Hash, Layers, FileAudio, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type Props = {
  track: Track | null;
  onClose: () => void;
};

export function TrackSidebar({ track, onClose }: Props) {
  if (!track) return null;

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[80]"
      />
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-zinc-900 border-l border-zinc-800 z-[90] shadow-2xl flex flex-col"
      >
        <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
          <h3 className="text-xl font-black tracking-tight text-white uppercase italic">Szczegóły Utworu</h3>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-zinc-800 rounded-full text-zinc-400 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-8">
          <div className="aspect-square w-full bg-zinc-800 rounded-2xl flex items-center justify-center mb-8 shadow-inner overflow-hidden border border-zinc-700">
            <Disc className="w-32 h-32 text-zinc-700 animate-spin-slow" />
          </div>

          <div className="mb-10 text-center">
            <h4 className="text-2xl font-black text-white mb-2 leading-tight">{track.title}</h4>
            <p className="text-indigo-400 font-bold text-lg">{track.artist}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <DetailCard icon={<Activity className="w-4 h-4" />} label="BPM" value={track.bpm?.toString() || '---'} />
            <DetailCard icon={<Music className="w-4 h-4" />} label="Klucz" value={track.key || '---'} />
            <DetailCard icon={<Clock className="w-4 h-4" />} label="Czas" value={formatDuration(track.duration)} />
            <DetailCard icon={<Layers className="w-4 h-4" />} label="Gatunek" value={track.genre || '---'} />
            <DetailCard icon={<FileAudio className="w-4 h-4" />} label="Format" value={track.format?.toUpperCase() || '---'} />
            <DetailCard icon={<Info className="w-4 h-4" />} label="Bitrate" value={track.bitrate ? `${track.bitrate} kbps` : '---'} />
            <DetailCard icon={<Hash className="w-4 h-4" />} label="Rok" value={track.year || '---'} />
            <DetailCard icon={<Disc className="w-4 h-4" />} label="Album" value={track.album || '---'} />
            
            <DetailCard icon={<Hash className="w-4 h-4" />} label="Nr ścieżki" value={track.trackNumber || '---'} />
            <DetailCard icon={<Layers className="w-4 h-4" />} label="Wydawca" value={track.publisher || '---'} />
            <DetailCard icon={<Info className="w-4 h-4" />} label="Etykieta" value={track.label || '---'} />
            <DetailCard icon={<Disc className="w-4 h-4" />} label="Kompozytor" value={track.composer || '---'} />
            
            <div className="col-span-2 p-4 bg-zinc-800/40 border border-zinc-800 rounded-2xl">
              <div className="flex items-center gap-2 text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">
                <Info className="w-4 h-4" />
                <span>Komentarz</span>
              </div>
              <div className="text-white text-xs leading-relaxed">{track.comment || 'Brak komentarza'}</div>
            </div>
          </div>

          {track.path && (
            <div className="mt-10 p-4 bg-black/40 rounded-xl border border-zinc-800">
              <div className="text-[10px] font-bold text-zinc-500 uppercase mb-2">Lokalizacja Pliku</div>
              <div className="text-xs font-mono text-zinc-400 break-all">{track.path}</div>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}

function DetailCard({ icon, label, value, className = "" }: { icon: React.ReactNode, label: string, value: string, className?: string }) {
  return (
    <div className={`p-4 bg-zinc-800/40 border border-zinc-800 rounded-2xl ${className}`}>
      <div className="flex items-center gap-2 text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">
        {icon}
        <span>{label}</span>
      </div>
      <div className="text-white font-black truncate">{value}</div>
    </div>
  );
}
