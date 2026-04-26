import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const mode = body.mode || "hash";

  // Simulate duplicate detection
  const groups = [
    {
      key: "group_1",
      similarity: 1.0,
      tracks: [
        { id: 1, artist: "Daft Punk", title: "One More Time", key: "8B" },
        { id: 101, artist: "Daft Punk", title: "One More Time (Copy)", key: "8B" },
      ]
    }
  ];

  return NextResponse.json({ groups });
}
