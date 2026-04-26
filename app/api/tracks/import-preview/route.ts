import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return NextResponse.json({ tracks: [], errors: ["Invalid JSON body"] }, { status: 400 });
  }
  const folder = body.folder || "";
  
  const formats = ["mp3", "flac", "wav", "m4a", "aac", "aiff", "ogg", "alac", "wma"];
  
  // Realistyczne skanowanie na podstawie ścieżki
  let previewTracks = [];

  const createTrack = (name: string, artist: string, title: string, format: string, bitrate: number, key?: string, bpm?: number) => ({
    id: 0,
    artist,
    title,
    path: `${folder}/${name}.${format}`,
    format,
    bitrate,
    key: key || "1A",
    bpm: bpm || 120,
    duration: 180 + Math.floor(Math.random() * 120),
    genre: "Electronic"
  });

  if (folder.includes("Selection") || folder.includes("Muzyka")) {
    previewTracks = [
      createTrack("Adam Beyer - Legend", "Adam Beyer", "Legend", "wav", 1411, "8A", 126),
      createTrack("Charlotte de Witte - Overdrive", "Charlotte de Witt", "Overdrive", "flac", 1024, "5B", 132),
      createTrack("Maceo Plex - Insomnia", "Maceo Plex", "Insomnia", "aiff", 1411, "4A", 124),
      createTrack("Fisher - Losing It", "Fisher", "Losing It", "mp3", 320, "11B", 125),
      createTrack("Anyma - Eternity", "Anyma", "Eternity", "m4a", 256, "9A", 124),
    ];
  } else if (folder.includes("Classics")) {
    previewTracks = [
      createTrack("Daft Punk - One More Time", "Daft Punk", "One More Time", "mp3", 320, "8B", 123),
      createTrack("Stardust - Music Sounds Better With You", "Stardust", "Music Sounds Better", "wav", 1411, "8B", 124),
    ];
  } else {
    previewTracks = [
      createTrack("New_Track_Mix_01", "Unknown", "New Track Mix 01", "ogg", 192),
      createTrack("Recording_Vocal_Final", "User", "Recording Vocal Final", "aac", 256),
    ];
  }

  return NextResponse.json({ tracks: previewTracks, errors: [] });
}
