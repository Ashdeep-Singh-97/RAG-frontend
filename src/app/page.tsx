export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
      <div className="w-full max-w-lg p-8 rounded-2xl border border-zinc-800 bg-zinc-900 shadow-lg">
        <h1 className="text-3xl font-bold tracking-tight">RAG Chat</h1>
        <p className="text-zinc-400 mt-2">
          Choose a mode to start chatting.
        </p>

        <div className="mt-8 grid gap-4">
          {/* <a
            href="/pdf"
            className="w-full rounded-xl bg-white text-black px-5 py-3 font-medium hover:bg-zinc-200 transition"
          >
            📄 PDF Chat
          </a> */}

          <a
            href="/website"
            className="w-full rounded-xl bg-white text-black px-5 py-3 font-medium hover:bg-zinc-200 transition"
          >
            🌐 Website Chat
          </a>
        </div>
      </div>
    </main>
  );
}
