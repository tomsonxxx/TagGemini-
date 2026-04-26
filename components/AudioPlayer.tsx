'use client';

import { useEffect, useMemo, useRef, useState } from "react";
import { Play, Pause, Volume2, Music } from "lucide-react";
import { motion } from "motion/react";

type Props = {
  src: string;
};

export function AudioPlayer({ src }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [error, setError] = useState<string>("");
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const audio = new Audio(src);
    audio.preload = "metadata";
    audioRef.current = audio;

    const onLoaded = () => {
      setDuration(audio.duration || 0);
      setError("");
    };
    const onError = () => {
      setPlaying(false);
      setError("Błąd odtwarzania pliku audio.");
      if (retryCount < 1) {
        setRetryCount((v) => v + 1);
        audio.load();
      }
    };
    const onTimeUpdate = () => setTime(audio.currentTime || 0);
    const onEnded = () => setPlaying(false);

    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("error", onError);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.pause();
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("error", onError);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
    };
  }, [src, retryCount]);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
      return;
    }
    audio
      .play()
      .then(() => {
        setPlaying(true);
        setError("");
      })
      .catch(() => {
        setError("Nie udało się uruchomić odtwarzania.");
        setPlaying(false);
      });
  }

  function seek(value: number) {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(value)) return;
    audio.currentTime = value;
    setTime(value);
  }

  const formatTime = (t: number) => {
    const mins = Math.floor(t / 60);
    const secs = Math.floor(t % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div 
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 p-4 shadow-2xl z-50"
    >
      <div className="max-w-4xl mx-auto flex items-center gap-4">
        <div className="flex-shrink-0 bg-zinc-800 p-3 rounded-lg">
          <Music className="w-6 h-6 text-indigo-400" />
        </div>
        
        <button 
          onClick={toggle}
          className="p-2 bg-indigo-600 hover:bg-indigo-500 rounded-full transition-colors text-white"
        >
          {playing ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 fill-current" />}
        </button>

        <div className="flex-grow">
          <div className="flex items-center gap-2 text-xs text-zinc-400 mb-1">
            <span>{formatTime(time)}</span>
            <div className="flex-grow h-1 bg-zinc-800 rounded-full overflow-hidden relative">
              <input
                type="range"
                min={0}
                max={Math.max(duration, 0)}
                step={0.1}
                value={Math.min(time, duration || 0)}
                onChange={(e) => seek(Number(e.target.value))}
                className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full"
              />
              <div 
                className="h-full bg-indigo-500" 
                style={{ width: `${(time / (duration || 1)) * 100}%` }}
              />
            </div>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-zinc-500" />
          <div className="w-20 h-1 bg-zinc-800 rounded-full" />
        </div>
      </div>
      {error && (
        <div className="text-xs text-red-500 text-center mt-2">{error}</div>
      )}
    </motion.div>
  );
}
