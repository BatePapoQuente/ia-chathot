'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

type Author = 'me' | 'hot';
type Message = { id: string; author: Author; text: string; timestamp: number };
type Thread = { id: string; title: string; messages: Message[]; favorite?: boolean };

const STORAGE_KEY = 'hub:threads';
const ORANGE = '#f97316';
const BG_DARK = '#0b0b0b';
const PANEL = '#1f1f1f';
const PANEL_2 = '#333333';

export default function ChatHub() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [query, setQuery] = useState('');
  const [input, setInput] = useState('');

  // carregar histórico
  useEffect(() => {
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

  // salvar
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(threads));
  }, [threads]);

  const listRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [activeId, threads]);

  const active = useMemo(() => threads.find(t => t.id === activeId), [threads, activeId]);

  // filtrar pela busca
  const filteredThreads = useMemo(() => {
    const q = query.toLowerCase();
    return threads.filter(t => `${t.title} ${t.messages.at(-1)?.text ?? ''}`.toLowerCase().includes(q));
  }, [threads, query]);

  function newThread() {
    const n: Thread = {
      id: crypto.randomUUID?.() ?? String(Date.now()),
      title: `Conversa ${threads.length + 1}`,
      messages: [
        { id: crypto.randomUUID?.() ?? String(Date.now()), author: 'hot', text: 'Conversa criada. Como posso ajudar? 🙂', timestamp: Date.now() },
      ],
    };
    setThreads(prev => [n, ...prev]);
    setActiveId(n.id);
  }

  function toggleFavorite(id: string) {
    setThreads(prev => prev.map(t => t.id === id ? { ...t, favorite: !t.favorite } : t));
  }

  function deleteThread(id: string) {
    const rest = threads.filter(t => t.id !== id);
    setThreads(rest);
    if (id === activeId) setActiveId(rest[0]?.id ?? '');
  }

  function renameThread(id: string) {
    const title = prompt('Novo título da conversa:')?.trim();
    if (!title) return;
    setThreads(prev => prev.map(t => t.id === id ? { ...t, title } : t));
  }

  function send() {
    const text = input.trim();
    if (!text || !active) return;
    const msg: Message = { id: crypto.randomUUID?.() ?? String(Date.now()), author: 'me', text, timestamp: Date.now() };
    setThreads(prev => prev.map(t => t.id === active.id ? { ...t, messages: [...t.messages, msg] } : t));
    setInput('');
    // auto reply simples
    setTimeout(() => {
      const reply: Message = { id: crypto.randomUUID?.() ?? String(Date.now()+1), author: 'hot', text: 'Anotado! 🔥', timestamp: Date.now() };
      setThreads(prev => prev.map(t => t.id === active.id ? { ...t, messages: [...t.messages, reply] } : t));
    }, 400);
  }

  function clearAll() {
    if (!confirm('Limpar todas as conversas?')) return;
    setThreads([]);
    localStorage.removeItem(STORAGE_KEY);
    newThread();
  }

  return (
    <div className="flex h-[calc(100vh-0px)]" style={{ backgroundColor: BG_DARK, color: '#e5e7eb' }}>
      {/* SIDEBAR (estilo ChatGPT) */}
      <aside className="hidden md:flex w-[280px] h-full flex-col border-r" style={{ borderColor: '#222' }}>
        {/* topo */}
        <div className="p-3 sticky top-0 z-10" style={{ backgroundColor: PANEL_2 }}>
          <button
            onClick={newThread}
            className="w-full text-sm px-3 py-2 rounded-lg"
            style={{ backgroundColor: ORANGE, color: '#fff' }}
          >
            + Novo chat
          </button>
        </div>

        {/* busca */}
        <div className="p-3" style={{ backgroundColor: PANEL }}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar conversa"
            className="w-full px-2 py-1 text-sm bg-transparent outline-none border-b"
            style={{ borderColor: '#2a2a2a' }}
          />
        </div>

        {/* lista de conversas */}
        <div className="flex-1 overflow-auto p-3 space-y-2" style={{ backgroundColor: BG_DARK }}>
          {filteredThreads.map(t => {
            const last = t.messages.at(-1);
            const isActive = t.id === activeId;
            return (
              <div
                key={t.id}
                onClick={() => setActiveId(t.id)}
                className={`rounded-lg border cursor-pointer ${isActive ? 'ring-1' : ''}`}
                style={{
                  backgroundColor: isActive ? '#252525' : '#171717',
                  borderColor: isActive ? ORANGE : '#2a2a2a',
                }}
              >
                <div className="p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium truncate">{t.title}</p>
                    <span className="text-xs opacity-70">{t.messages.length}</span>
                  </div>
                  <p className="text-sm opacity-70 line-clamp-1 mt-1">{last?.text ?? '—'}</p>
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); renameThread(t.id); }}
                      className="text-xs px-2 py-1 rounded border"
                      style={{ borderColor: '#2a2a2a' }}
                    >
                      Renomear
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteThread(t.id); }}
                      className="text-xs px-2 py-1 rounded border border-red-500/40 text-red-400"
                    >
                      Excluir
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(t.id); }}
                      className="text-xs px-2 py-1 rounded border"
                      style={{ borderColor: t.favorite ? ORANGE : '#2a2a2a', color: t.favorite ? ORANGE : undefined }}
                    >
                      ★ Fav
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* rodapé */}
        <div className="p-3 border-t" style={{ borderColor: '#222', backgroundColor: PANEL_2 }}>
          <button
            onClick={clearAll}
            className="w-full text-sm px-3 py-2 rounded-lg border"
            style={{ borderColor: '#2a2a2a', backgroundColor: '#1a1a1a' }}
          >
            Limpar todas
          </button>
        </div>
      </aside>

      {/* CONTEÚDO */}
      <main className="flex-1 h-full flex flex-col">
        {/* topbar */}
        <div className="h-14 px-4 flex items-center justify-between border-b sticky top-0 z-10"
             style={{ backgroundColor: PANEL_2, borderColor: '#222' }}>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg grid place-items-center text-white" style={{ backgroundColor: ORANGE }}>
              <span className="text-xs font-bold">HB</span>
            </div>
            <div>
              <p className="font-semibold leading-4">{active?.title ?? '—'}</p>
              <span className="text-xs opacity-80">Hot Bertho • online</span>
            </div>
          </div>
        </div>

        {/* mensagens */}
        <div ref={listRef} className="flex-1 overflow-auto p-4 space-y-2" style={{ backgroundColor: BG_DARK }}>
          {active?.messages.map(m => (
            <Bubble key={m.id} author={m.author} text={m.text} timestamp={m.timestamp} />
          ))}
        </div>

        {/* input */}
        <div className="p-3 border-t" style={{ backgroundColor: PANEL, borderColor: '#222' }}>
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => (e.key === 'Enter' ? send() : null)}
              placeholder="Escreva sua mensagem…"
              className="flex-1 px-4 py-3 rounded-xl outline-none border"
              style={{ backgroundColor: '#111', borderColor: '#2a2a2a' }}
            />
            <button
              onClick={send}
              className="px-4 py-3 rounded-xl text-white hover:opacity-90"
              style={{ backgroundColor: ORANGE }}
            >
              Enviar
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

function Bubble({ author, text, timestamp }: { author: Author; text: string; timestamp: number }) {
  const me = author === 'me';
  const time = new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return (
    <div className={`flex ${me ? 'justify-end' : 'justify-start'}`}>
      <div
        className="max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow border"
        style={
          me
            ? { backgroundColor: '#f97316', color: '#fff', borderColor: '#f97316' }
            : { backgroundColor: '#171717', color: '#e5e7eb', borderColor: '#2a2a2a' }
        }
      >
        <p className="whitespace-pre-wrap">{text}</p>
        <span className="block text-[10px] mt-1 opacity-80">{time}</span>
      </div>
    </div>
  );
}

