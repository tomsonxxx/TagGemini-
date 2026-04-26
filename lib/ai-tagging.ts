import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import type { Track } from "./types";

const ai = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

export async function enrichTrackWithAI(track: Partial<Track>): Promise<Partial<Track>> {
  const prompt = `Jesteś ekspertem od metadanych muzycznych i technologii audio. 
Przeanalizuj ścieżkę pliku, nazwę i wstępne dane. 
Symulujemy również głęboką analizę fali dźwiękowej (spectral analysis, beat detection).

Plik: ${track.path}
Format: ${track.format}
Wstępne dane: ${track.artist} - ${track.title}

Na podstawie tych informacji zaproponuj pełne, profesjonalne tagi ID3. 
Dla BPM i Key wykonaj "wirtualną detekcję" (analiza rytmu i harmonii).

Zwróć rozszerzony zestaw tagów w formacie JSON.`;

  try {
    const model = ai.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            title: { type: SchemaType.STRING },
            artist: { type: SchemaType.STRING },
            album: { type: SchemaType.STRING },
            genre: { type: SchemaType.STRING },
            year: { type: SchemaType.STRING },
            trackNumber: { type: SchemaType.STRING },
            bpm: { type: SchemaType.NUMBER },
            key: { type: SchemaType.STRING },
            comment: { type: SchemaType.STRING },
            composer: { type: SchemaType.STRING },
            publisher: { type: SchemaType.STRING },
            label: { type: SchemaType.STRING },
            mood: { type: SchemaType.STRING },
            energy: { type: SchemaType.INTEGER },
            remixer: { type: SchemaType.STRING },
            encodedBy: { type: SchemaType.STRING },
          },
        },
      },
    });

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    if (!text) throw new Error("Empty response from AI");
    const jsonResult = JSON.parse(text);
    return { ...track, ...jsonResult };
  } catch (error) {
    console.error("AI Tagging error:", error);
    return track;
  }
}

export async function batchEnrichTracksWithAI(tracks: Partial<Track>[]): Promise<Partial<Track>[]> {
  // To avoid hitting rate limits or making too many calls, we could batch,
  // but for simplicity in this demo, let's process them in parallel in chunks.
  const results = await Promise.all(tracks.map(t => enrichTrackWithAI(t)));
  return results;
}
