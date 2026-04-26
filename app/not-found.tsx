import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-4">
      <h2 className="text-2xl font-black mb-4">404 - NIE ZNALEZIONO</h2>
      <Link href="/" className="px-6 py-2 bg-cyan-500 text-cyan-950 font-bold rounded hover:bg-cyan-400 transition-colors">
        POWRÓT DO BIBLIOTEKI
      </Link>
    </div>
  );
}
