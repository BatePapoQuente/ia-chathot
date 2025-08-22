'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

type Author = 'me' | 'hot';
type Message = { id: string; author: Author; text: string; timestamp: number };
type Thread = { id: string; title: string; messages: Message[] };

const STORAGE_KEY = 'hub:threads';

export default function ChatHub() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [query, setQuery] = useState('');
  const [input, setInput] = useState('');
  const listRef = useRef<HTMLDivElement>(null);

  // carregar e salvar
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed: Thread[] = JSON.parse(raw);
      setThreads(parsed);
      setActiveId(parsed[0]?.id ?? '');
    } else {
      const first: Thread = {
        id: crypto.randomUUID?.() ?? String(Date.now()),
        title: 'Geral',
        messages: [
          {
            id: crypto.randomUUID?.() ?? String(Date.now()),
            author: 'hot',
            text: 'Olá! Eu sou o Hot Bertho 🔥. Esta é sua primeira conversa.',
            timestamp: Date.now(),
          },
        ],
      };
      setThreads([first]);
      setActiveId(first.id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify([first]));
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(threads));
  }, [threads]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [activeId, threads]);

  const active = useMemo(
    () => threads.find((t) => t.id === activeId),
    [threads, activeId]
  );

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return threads.filter((t) => {
      const last = t.messages[t.messages.length - 1];
      const hay = `${t.title} ${last?.text ?? ''}`.toLowerCase();
      return hay.includes(q);
    });
  }, [threads, query]);

  function newThread() {
    const idx = threads.length + 1;
    const t: Thread = {
      id: crypto.randomUUID?.() ?? String(Date.now()),
      title: `Conversa ${idx}`,
      messages: [
        {
          id: crypto.randomUUID?.() ?? String(Date.now()),
          author: 'hot',
          text: 'Conversa criada. Como posso ajudar? 🙂',
          timestamp: Date.now(),
        },
      ],
    };
    setThreads((prev) => [t, ...prev]);
    setActiveId(t.id);
  }

  function deleteThread(id: string) {
    const rest = threads.filter((t) => t.id !== id);
    setThreads(rest);
    if (id === activeId) setActiveId(rest[0]?.id ?? '');
  }

  function renameThread(id: string) {
    const title = prompt('Novo título da conversa:')?.trim();
    if (!title) return;
    setThreads((prev) => prev.map((t) => (t.id === id ? { ...t, title } : t)));
  }

  function clearAll() {
    if (!confirm('Limpar todas as conversas?')) return;
    setThreads([]);
    localStorage.removeItem(STORAGE_KEY);
    newThread();
  }

  function send() {
    const text = input.trim();
    if (!text || !active) return;
    const msg: Message = {
      id: crypto.randomUUID?.() ?? String(Date.now()),
      author: 'me',
      text,
      timestamp: Date.now(),
    };
    setThreads((prev) =>
      prev.map((t) => (t.id === active.id ? { ...t, messages: [...t.messages, msg] } : t))
    );
    setInput('');

    // resposta simples do Hot Bertho (pode remover se não quiser)
    setTimeout(() => {
      const reply: Message = {
        id: crypto.randomUUID?.() ?? String(Date.now() + 1),
        author: 'hot',
        text: 'Anotado! 🔥',
        timestamp: Date.now(),
      };
      setThreads((prev) =>
        prev.map((t) =>
          t.id === active.id ? { ...t, messages: [...t.messages, reply] } : t
        )
      );
    }, 400);
  }

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-56px)] grid grid-cols-1 lg:grid-cols-12 gap-4 p-4">
      {/* SIDEBAR */}
      <aside className="lg:col-span-3 flex flex-col rounded-2xl border bg-white shadow-sm dark:bg-[#333333] dark:border-zinc-800">
        {/* topo sidebar */}
        <div className="p-3 border-b bg-[#333333] text-white rounded-t-2xl dark:border-zinc-700">
          <div className="flex items-center justify-between">
            <span className="font-semibold">Conversas</span>
            <button
              onClick={newThread}
              className="text-xs px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white"
            >
              Nova
            </button>
          </div>
        </div>

        {/* busca */}
        <div className="p-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar conversa…"
            className="w-full px-3 py-2 rounded-xl border bg-white outline-none focus:ring-2 focus:ring-orange-200 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100"
          />
        </div>

        {/* lista */}
        <div className="flex-1 overflow-auto p-3 space-y-2">
          {filtered.map((t) => {
            const last = t.messages[t.messages.length - 1];
            const activeStyle =
              t.id === activeId
                ? 'border-orange-500 bg-orange-50 dark:bg-zinc-800'
                : 'border-zinc-200 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800/50';
            return (
              <div
                key={t.id}
                className={`rounded-xl border p-3 cursor-pointer ${activeStyle}`}
                onClick={() => setActiveId(t.id)}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{t.title}</span>
                  <span className="text-xs opacity-60">{t.messages.length}</span>
                </div>
                <p className="text-sm opacity-70 line-clamp-1">{last?.text ?? '—'}</p>
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      renameThread(t.id);
                    }}
                    className="text-xs px-2 py-1 rounded-md border border-zinc-200 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-100"
                  >
                    Renomear
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteThread(t.id);
                    }}
                    className="text-xs px-2 py-1 rounded-md border border-red-300 text-red-600 hover:bg-red-50 dark:border-red-400/40 dark:text-red-300"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-3 border-t dark:border-zinc-700">
          <button
            onClick={clearAll}
            className="w-full text-sm px-3 py-2 rounded-lg border bg-white hover:bg-zinc-50 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:border-zinc-700 dark:text-zinc-100"
          >
            Limpar todas
          </button>
        </div>
      </aside>

      {/* ÁREA PRINCIPAL */}
      <main className="lg:col-span-9 rounded-2xl border bg-white shadow-sm dark:bg-zinc-900 dark:border-zinc-800 flex flex-col">
        {/* topbar */}
        <div className="h-14 px-4 flex items-center justify-between border-b bg-[#333333] text-white rounded-t-2xl dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl grid place-items-center text-white" style={{ backgroundColor: '#f97316' }}>
              <span className="text-xs font-bold">HB</span>
            </div>
            <div>
              <p className="font-semibold leading-4">{active?.title ?? '—'}</p>
              <span className="text-xs opacity-80">Hot Bertho • online</span>
            </div>
          </div>
        </div>

        {/* mensagens */}
        <div ref={listRef} className="flex-1 overflow-auto p-4 space-y-2">
          {active?.messages.map((m) => (
            <Bubble key={m.id} author={m.author} text={m.text} timestamp={m.timestamp} />
          ))}
        </div>

        {/* input */}
        <div className="p-3 border-t dark:border-zinc-800">
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => (e.key === 'Enter' ? send() : null)}
              placeholder="Escreva sua mensagem…"
              className="flex-1 px-4 py-3 rounded-xl border bg-white outline-none focus:ring-2 focus:ring-orange-200 dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-100"
            />
            <button
              onClick={send}
              className="px-4 py-3 rounded-xl text-white hover:opacity-90"
              style={{ backgroundColor: '#f97316' }} // laranja quente
            >
              Enviar
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

function Bubble({
  author,
  text,
  timestamp,
}: {
  author: Author;
  text: string;
  timestamp: number;
}) {
  const me = author === 'me';
  const time = new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
  return (
    <div className={`flex ${me ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow border`}
        style={
          me
            ? {
                backgroundColor: '#f97316',
                color: '#fff',
                borderColor: '#f97316',
              }
            : {
                backgroundColor: '#fff',
                color: '#111827',
                borderColor: '#e5e7eb',
              }
        }
      >
        <p className="whitespace-pre-wrap">{text}</p>
        <span className="block text-[10px] mt-1 opacity-80">{time}</span>
      </div>
    </div>
  );
}
