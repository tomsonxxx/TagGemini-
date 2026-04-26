'use client';

import { useEffect, useState } from "react";
import type { DuplicateGroup, DuplicateAnalysisResult } from "@/lib/types";
import { X, Trash2, Search, Check, Copy } from "lucide-react";
import { motion } from "motion/react";

type Props = {
  open: boolean;
  onClose: () => void;
};

type Mode = "hash" | "fingerprint" | "metadata";

export function DuplicateFinderModal({ open, onClose }: Props) {
  const [mode, setMode] = useState<Mode>("hash");
  const [groups, setGroups] = useState<DuplicateGroup[]>([]);
  const [removed, setRemoved] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    
    let isMounted = true;
    const fetchDuplicates = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/duplicates/analyze', {
          method: 'POST',
          body: JSON.stringify({ mode })
        });
        const result: DuplicateAnalysisResult = await res.json();
        if (isMounted) {
          setGroups(result.groups);
          setError("");
        }
      } catch (err) {
        if (isMounted) {
          setGroups([]);
          setError(err instanceof Error ? err.message : "Nie udało się wykryć duplikatów.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void fetchDuplicates();
    return () => { isMounted = false; };
  }, [open, mode]);

  function keepFirst(group: DuplicateGroup) {
    const idsToRemove = group.tracks.slice(1).map((x) => x.id);
    setRemoved((prev) => [...prev, ...idsToRemove]);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh]"
      >
        <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50 flex-shrink-0">
          <div className="flex items-center gap-3">
            <Copy className="w-6 h-6 text-indigo-400" />
            <h3 className="text-xl font-bold text-white uppercase tracking-wider">Detektor Duplikatów</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full text-zinc-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 border-b border-zinc-800 bg-black/20 flex-shrink-0">
          <div className="flex items-center gap-4">
            <label className="text-xs font-bold text-zinc-500 uppercase">Metoda Analizy:</label>
            <div className="flex gap-1 p-1 bg-zinc-800 rounded-lg">
              {(['hash', 'fingerprint', 'metadata'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${
                    mode === m 
                    ? 'bg-indigo-600 text-white shadow-lg' 
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-700'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-grow overflow-y-auto p-6 space-y-6 bg-zinc-900/30">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 animate-pulse">
              <Search className="w-12 h-12 text-zinc-700 mb-4 animate-bounce" />
              <div className="text-zinc-500 text-sm">Analiza plików w bibliotece...</div>
            </div>
          ) : groups.length === 0 ? (
              <div className="text-center py-20 text-zinc-500">
                Nie znaleziono duplikatów przy użyciu metody {mode}.
              </div>
          ) : (
            groups.map((group, idx) => (
              <div key={group.key} className="bg-zinc-800/50 border border-zinc-800 rounded-xl p-5 space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="bg-zinc-700 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-tighter">Grupa {idx + 1}</span>
                    <span className="text-[10px] text-zinc-500 font-medium">Podobieństwo: {Math.round(group.similarity * 100)}%</span>
                  </div>
                  <button 
                    onClick={() => keepFirst(group)}
                    className="text-[10px] font-bold text-indigo-400 hover:text-white flex items-center gap-1 transition-colors bg-indigo-500/10 px-2 py-1 rounded"
                  >
                    <Check className="w-3 h-3" /> Zachowaj tylko pierwszy
                  </button>
                </div>
                
                <div className="space-y-2">
                  {group.tracks.map((track) => (
                    <div 
                      key={track.id} 
                      className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                        removed.includes(track.id) 
                        ? 'bg-red-900/10 border-red-900/40 opacity-40' 
                        : 'bg-black/20 border-zinc-700/30'
                      }`}
                    >
                      <div className="min-w-0 flex-grow">
                        <div className="text-sm font-medium text-white truncate">{track.artist} - {track.title}</div>
                        <div className="text-[10px] text-zinc-500 font-mono">ID: {track.id} • Key: {track.key}</div>
                      </div>
                      {removed.includes(track.id) && (
                        <Trash2 className="w-4 h-4 text-red-500 flex-shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 border-t border-zinc-800 bg-zinc-900/50 flex justify-end flex-shrink-0">
          <button 
            onClick={onClose}
            className="px-8 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-white font-bold transition-all"
          >
            Zamknij
          </button>
        </div>
      </motion.div>
    </div>
  );
}
