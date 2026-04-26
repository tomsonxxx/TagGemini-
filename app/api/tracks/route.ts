import { NextResponse } from 'next/server';
import type { Track } from '@/lib/types';

// Mock database
let mockTracks: Track[] = [
  { id: 1, artist: "Daft Punk", title: "One More Time", key: "8B", bpm: 123, duration: 320, genre: "House", format: "mp3", bitrate: 320 },
  { id: 2, artist: "The Chemical Brothers", title: "Galvanize", key: "7A", bpm: 104, duration: 393, genre: "Big Beat", format: "flac", bitrate: 1050 },
  { id: 3, artist: "Justice", title: "D.A.N.C.E.", key: "11B", bpm: 113, duration: 242, genre: "Nu-Disco", format: "m4a", bitrate: 256 },
  { id: 4, artist: "Modjo", title: "Lady (Hear Me Tonight)", key: "8B", bpm: 126, duration: 306, genre: "House", format: "mp3", bitrate: 320 },
  { id: 5, artist: "Stardust", title: "Music Sounds Better With You", key: "8B", bpm: 124, duration: 403, genre: "House", format: "wav", bitrate: 1411 },
];

export async function GET() {
  return NextResponse.json({ tracks: mockTracks });
}

export async function POST(request: Request) {
  const body = await request.json();
  // Simulate import commit
  if (body.paths) {
    const newTracks = body.paths.map((path: string, index: number) => {
      const fileName = path.split('/').pop() || "Unknown";
      const extension = fileName.split('.').pop()?.toLowerCase() || "mp3";
      
      // Prosta logika tagowania z nazwy (YouTube pattern)
      let artist = "New Artist";
      let title = fileName.replace(`.${extension}`, "");
      
      if (title.includes(" - ")) {
        const parts = title.split(" - ");
        artist = parts[0];
        title = parts[1].split("(")[0].trim(); // Usuwamy info z nawiasów
      }

      return {
        id: mockTracks.length + index + 1,
        artist,
        title,
        path: path,
        format: extension,
        key: "1A",
        bpm: 120,
        duration: 180,
        bitrate: extension === 'flac' || extension === 'wav' ? 1411 : 320
      };
    });
    mockTracks = [...mockTracks, ...newTracks];
    return NextResponse.json({ imported: newTracks.length, errors: [] });
  }
  return NextResponse.json({ error: "Invalid request" }, { status: 400 });
}
