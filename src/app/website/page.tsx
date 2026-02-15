"use client";

import { useState } from "react";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export default function WebsitePage() {
  const [url, setUrl] = useState("");
  const [processed, setProcessed] = useState(false);

  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; text: string }[]
  >([]);

  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false); // ✅ Typing indicator

  async function processWebsite() {
    if (!url) return alert("Enter website URL");

    setLoading(true);

    const res = await fetch(`${BASE_URL}/api/website/process`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });

    const data = await res.json();
    setLoading(false);

    if (!data.success) {
      alert(data.error || "Processing failed");
      return;
    }

    setProcessed(true);
  }

  async function sendMessage() {
    if (!question) return;

    const userMsg = question;
    setQuestion("");

    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setIsTyping(true); // ✅ Start typing

    const res = await fetch(`${BASE_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: userMsg,
        source: "web",
      }),
    });

    const data = await res.json();

    setMessages((prev) => [
      ...prev,
      { role: "assistant", text: data.answer || "No answer" },
    ]);

    setIsTyping(false); // ✅ Stop typing
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex justify-center p-6">
      <div className="w-full max-w-3xl">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">🌐 Website Chat</h1>

          <a href="/"
            className="text-sm text-zinc-400 hover:text-white transition"
          >
            ← Back
          </a>
        </div>

        {!processed ? (
          <div className="mt-8 p-6 rounded-2xl border border-zinc-800 bg-zinc-900">
            <p className="text-zinc-400 text-sm mb-4">
              Enter a website link. We will crawl and index it.
            </p>

            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 text-sm outline-none focus:border-white"
            />

            <button
              onClick={processWebsite}
              disabled={loading}
              className="mt-5 w-full rounded-xl bg-white text-black py-3 font-medium hover:bg-zinc-200 transition disabled:opacity-50"
            >
              {loading ? "Processing..." : "Process & Index Website"}
            </button>
          </div>
        ) : (
          <div className="mt-8">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 h-105 overflow-y-auto">
              {messages.length === 0 ? (
                <p className="text-zinc-500 text-sm">
                  Ask your first question about the website...
                </p>
              ) : (
                <div className="space-y-4">
                  {messages.map((m, i) => (
                    <div
                      key={i}
                      className={`p-4 rounded-xl max-w-[80%] ${m.role === "user"
                          ? "ml-auto bg-white text-black"
                          : "mr-auto bg-zinc-800 text-white"
                        }`}
                    >
                      <p className="text-sm whitespace-pre-line">{m.text}</p>
                    </div>
                  ))}

                  {/* ✅ Typing indicator */}
                  {isTyping && (
                    <div className="p-4 rounded-xl max-w-[80%] mr-auto bg-zinc-800 text-white">
                      <div className="flex gap-1.5">
                        <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="mt-4 flex gap-3">
              <input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isTyping) {
                    sendMessage();
                  }
                }}
                placeholder="Ask something..."
                className="flex-1 rounded-xl bg-zinc-900 border border-zinc-800 px-4 py-3 text-sm outline-none focus:border-white"
              />

              <button
                onClick={sendMessage}
                disabled={isTyping}
                className="rounded-xl bg-white text-black px-6 font-medium hover:bg-zinc-200 transition disabled:opacity-50"
              >
                {isTyping ? "..." : "Send"}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
