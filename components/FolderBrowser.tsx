'use client';

import { useState } from "react";
import { Folder, ChevronRight, HardDrive, Music } from "lucide-react";
import { motion } from "motion/react";

type FolderItem = {
  name: string;
  type: 'folder' | 'file';
  children?: FolderItem[];
};

const MOCK_FS: FolderItem[] = [
  {
    name: "Documents",
    type: "folder",
    children: [
      { name: "Work", type: "folder" },
    ],
  },
  {
    name: "Music",
    type: "folder",
    children: [
      { name: "2024 House Selection", type: "folder" },
      { name: "Classics", type: "folder" },
      { name: "Unsorted", type: "folder" },
    ],
  },
  {
    name: "Downloads",
    type: "folder",
    children: [
      { name: "New Rip", type: "folder" },
    ],
  },
];

type Props = {
  onSelect: (path: string) => void;
};

export function FolderBrowser({ onSelect }: Props) {
  const [currentPath, setCurrentPath] = useState<string[]>(["Root"]);
  const [history, setHistory] = useState<FolderItem[][]>([MOCK_FS]);

  const currentItems = history[history.length - 1];

  const navigateTo = (folder: FolderItem) => {
    if (folder.children) {
      setCurrentPath([...currentPath, folder.name]);
      setHistory([...history, folder.children]);
    }
  };

  const goBack = (index: number) => {
    if (index === 0) {
      setCurrentPath(["Root"]);
      setHistory([MOCK_FS]);
    } else {
      setCurrentPath(currentPath.slice(0, index + 1));
      setHistory(history.slice(0, index + 1));
    }
  };

  const getFullPath = () => {
    return currentPath.join("/").replace("Root", "D:");
  };

  return (
    <div className="border border-zinc-800 rounded-xl overflow-hidden bg-black/40">
      <div className="bg-zinc-800/50 p-2 flex items-center gap-1 overflow-x-auto no-scrollbar border-b border-zinc-800">
        {currentPath.map((name, i) => (
          <div key={i} className="flex items-center gap-1 shrink-0">
            <button 
              onClick={() => goBack(i)}
              className="px-2 py-1 text-xs font-bold text-zinc-400 hover:text-white transition-colors"
            >
              {name}
            </button>
            {i < currentPath.length - 1 && <ChevronRight className="w-3 h-3 text-zinc-600" />}
          </div>
        ))}
      </div>

      <div className="p-2 max-h-64 overflow-y-auto divide-y divide-zinc-800/50">
        {currentItems.map((item) => (
          <button
            key={item.name}
            onClick={() => navigateTo(item)}
            className="w-full flex items-center gap-3 p-3 hover:bg-indigo-500/10 rounded-lg group transition-all text-left"
          >
            <Folder className="w-5 h-5 text-zinc-500 group-hover:text-indigo-400" />
            <div className="flex-grow">
              <div className="text-sm font-medium text-zinc-300 group-hover:text-white">{item.name}</div>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-700 group-hover:text-indigo-500" />
          </button>
        ))}
        {currentItems.length === 0 && (
          <div className="py-12 text-center text-zinc-500 italic text-sm">
            Katalog jest pusty
          </div>
        )}
      </div>

      <div className="p-4 bg-zinc-900/50 border-t border-zinc-800 flex justify-between items-center">
        <div className="text-[10px] font-mono text-zinc-500 truncate max-w-[70%]">
          Wybrana ścieżka: {getFullPath()}
        </div>
        <button 
          onClick={() => onSelect(getFullPath())}
          className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold rounded-lg transition-all"
        >
          Wybierz ten folder
        </button>
      </div>
    </div>
  );
}
