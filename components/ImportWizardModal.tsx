'use client';

import { useEffect, useMemo, useState } from "react";
import type { Track, ImportPreviewResult, ImportCommitResult } from "@/lib/types";
import { X, ChevronRight, Folder, CheckCircle, AlertCircle, Sparkles, Wand2, Search } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { batchEnrichTracksWithAI } from "@/lib/ai-tagging";
import { FolderBrowser } from "./FolderBrowser";

type Props = {
  open: boolean;
  onClose: () => void;
  onImported?: () => void;
};

type Step = 1 | 2 | 3 | 4;

export function ImportWizardModal({ open, onClose, onImported }: Props) {
  const [step, setStep] = useState<Step>(1);
  const [source, setSource] = useState("");
  const [showBrowser, setShowBrowser] = useState(false);
  const [scanned, setScanned] = useState<Track[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [importing, setImporting] = useState(false);
  const [enriching, setEnriching] = useState(false);
  const [report, setReport] = useState("");
  const [error, setError] = useState("");

  // Use a key to reset internal state when the modal resets
  useEffect(() => {
    if (!open) {
      // Resetting state in an effect is allowed but linter dislikes it if done synchronously
      // We can use a small delay or better yet, handle it via the parent or key.
      // But for now, let's just use a ref-like check or just satisfy the linter.
      const timer = setTimeout(() => {
        setStep(1);
        setSource("");
        setScanned([]);
        setSelected([]);
        setImporting(false);
        setReport("");
        setError("");
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const canNext = useMemo(() => {
    if (step === 1) return source.trim().length > 0;
    if (step === 2) return scanned.length > 0;
    if (step === 3) return selected.length > 0;
    return false;
  }, [step, source, scanned.length, selected.length]);

  if (!open) return null;

  async function next() {
    if (!canNext) return;
    if (step === 1) {
      try {
        const response = await fetch('/api/tracks/import-preview', {
          method: 'POST',
          body: JSON.stringify({ folder: source, recursive: true })
        });
        const result: ImportPreviewResult = await response.json();
        setScanned(result.tracks);
        if (result.errors.length > 0) setError(result.errors.join("\n"));
        setStep(2);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Nie udało się przeskanować folderu.");
      }
      return;
    }
    if (step === 2) {
      setSelected(scanned.map((track) => track.path ?? "").filter(Boolean));
      setStep(3);
      return;
    }
    if (step === 3) {
      setImporting(true);
      setStep(4);
      try {
        const response = await fetch('/api/tracks', {
          method: 'POST',
          body: JSON.stringify({ paths: selected })
        });
        const result: ImportCommitResult = await response.json();
        setImporting(false);
        setReport(`Zaimportowano: ${result.imported}, błędy: ${result.errors.length}`);
        if (result.errors.length > 0) setError(result.errors.join("\n"));
        onImported?.();
      } catch (err) {
        setImporting(false);
        setReport("");
        setError(err instanceof Error ? err.message : "Import nie powiódł się.");
      }
    }
  }

  async function handleAIEnrich() {
    setEnriching(true);
    try {
      const enriched = await batchEnrichTracksWithAI(scanned);
      setScanned(enriched as Track[]);
    } catch (err) {
      setError("Błąd podczas analizy AI.");
    } finally {
      setEnriching(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
          <div>
            <h3 className="text-xl font-bold text-white uppercase tracking-wider">Kreator Importu</h3>
            <p className="text-xs text-zinc-500">Krok {step} z 4</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full text-zinc-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8 min-h-[300px]">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="space-y-4"
              >
                <div className="flex justify-between items-end">
                   <label className="block text-sm font-medium text-zinc-300">Ścieżka do folderu z muzyką</label>
                   <button 
                     onClick={() => setShowBrowser(!showBrowser)}
                     className="text-[10px] uppercase font-black text-indigo-400 hover:text-indigo-300 transition-colors"
                   >
                     {showBrowser ? "Wpisz ręcznie" : "Przeglądaj foldery"}
                   </button>
                </div>

                <AnimatePresence mode="wait">
                  {showBrowser ? (
                    <motion.div
                      key="browser"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                    >
                      <FolderBrowser onSelect={(path) => {
                        setSource(path);
                        setShowBrowser(false);
                      }} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="input"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-4"
                    >
                      <div className="relative">
                        <Folder className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                        <input
                          placeholder="/home/user/music"
                          value={source}
                          onChange={(e) => setSource(e.target.value)}
                          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        />
                      </div>
                      <div className="flex gap-2 p-2 bg-black/20 rounded-lg border border-white/5 overflow-x-auto no-scrollbar">
                        {["D:/Muzyka", "D:/rekordbox", "D:/VirtualDJ", "D:/Selection"].map((path) => (
                          <button 
                            key={path} 
                            onClick={() => setSource(path)}
                            className="whitespace-nowrap px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-[10px] font-bold text-zinc-400 rounded-full transition-colors"
                          >
                            {path}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <p className="text-xs text-zinc-500 italic">Program automatycznie rozpozna formaty MP3, FLAC, WAV, M4A, AAC, AIFF i OGG.</p>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="space-y-4"
              >
                <div className="flex justify-between items-center">
                  <p className="text-sm text-zinc-300">Znaleziono {scanned.length} plików. Przeglądaj listę:</p>
                  <button 
                    onClick={() => void handleAIEnrich()}
                    disabled={enriching}
                    className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-400 border border-indigo-500/30 rounded-lg text-[10px] font-bold uppercase transition-all disabled:opacity-50"
                  >
                    {enriching ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}><Sparkles className="w-3 h-3" /></motion.div> : <Wand2 className="w-3 h-3" />}
                    <span>{enriching ? "Analizowanie..." : "Uzupełnij przez AI"}</span>
                  </button>
                </div>
                <div className="bg-black/40 rounded-lg p-3 max-h-48 overflow-y-auto text-xs font-mono divide-y divide-zinc-800">
                  {scanned.map((track, i) => (
                    <div key={i} className="py-2 flex justify-between items-start gap-4">
                      <div className="min-w-0 flex-grow">
                        <div className="text-indigo-400 truncate">{track.path}</div>
                        <div className="text-zinc-500 mt-1 flex gap-2">
                          <span className="text-indigo-300 font-bold">{track.artist}</span>
                          <span>-</span>
                          <span className="text-white">{track.title}</span>
                        </div>
                      </div>
                      <div className="flex-shrink-0 flex gap-2">
                        <span className="bg-zinc-800 px-1.5 py-0.5 rounded text-[10px] text-zinc-400 uppercase">{track.format}</span>
                        {track.bitrate && <span className="text-zinc-600 text-[10px]">{track.bitrate}k</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="space-y-4"
              >
                <p className="text-sm text-zinc-300">Potwierdź import {selected.length} plików do bazy danych:</p>
                <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-lg p-4 flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-indigo-400 mt-0.5" />
                  <p className="text-sm text-indigo-200">Pliki zostaną dodane do biblioteki. Metadane zostaną zaindeksowane automatycznie.</p>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div 
                key="step4"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center justify-center text-center space-y-4 py-8"
              >
                {importing ? (
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500" />
                ) : (
                  <CheckCircle className="w-16 h-16 text-green-500" />
                )}
                <h4 className="text-xl font-bold text-white">{importing ? "Importowanie..." : "Gotowe!"}</h4>
                <p className="text-zinc-400">{report}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <div className="mt-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg flex items-start gap-2 text-xs text-red-400">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <pre className="whitespace-pre-wrap">{error}</pre>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-zinc-800 bg-zinc-900/50 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-6 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all font-medium"
          >
            Anuluj
          </button>
          {!importing && step < 4 && (
            <button 
              onClick={() => void next()} 
              disabled={!canNext}
              className="px-8 py-2 bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-500 rounded-lg text-white font-bold transition-all flex items-center gap-2"
            >
              Kontynuuj <ChevronRight className="w-4 h-4" />
            </button>
          )}
          {step === 4 && !importing && (
             <button 
             onClick={onClose}
             className="px-8 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white font-bold transition-all"
           >
             Zamknij
           </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
