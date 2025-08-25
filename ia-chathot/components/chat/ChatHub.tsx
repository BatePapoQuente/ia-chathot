"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import ConversationItem from "./ConversationItem";

type Author = "me" | "hot";
type Message = { id: string; author: Author; text: string; timestamp: number };
type Thread  = { id: string; title: string; messages: Message[]; favorite?: boolean };

const STORAGE_KEY = "hub:threads";
const ORANGE = "#f97316";

export default function ChatHub() {
  const [threads, setThreads]   = useState<Thread[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [query, setQuery]       = useState<string>("");
  const [input, setInput]       = useState<string>("");

  // carregar/salvar histórico
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed: Thread[] = JSON.parse(raw);
      setThreads(parsed);
      setActiveId(parsed[0]?.id ?? "");
    } else {
      const first: Thread = {
        id: crypto.randomUUID?.() ?? String(Date.now()),
        title: "Geral",
        messages: [
          {
            id: crypto.randomUUID?.() ?? String(Date.now()),
            author: "hot",
            text: "Olá! Eu sou o Hot Bertho 🔥. Esta é sua primeira conversa.",
            timestamp: Date.now(),
          },
        ],
      };
      setThreads([first]);
      setActiveId(first.id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify([first]));
    }
  }, []);
  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(threads)), [threads]);

  const active = useMemo(() => threads.find(t => t.id === activeId), [threads, activeId]);

  const filteredThreads = useMemo(() => {
    const q = query.toLowerCase();
    return threads.filter(t => {
      const first = t.messages[0]?.text ?? "";
      const last  = t.messages.at(-1)?.text ?? "";
      return `${first} ${last}`.toLowerCase().includes(q);
    });
  }, [threads, query]);

  function newThread() {
    const n: Thread = {
      id: crypto.randomUUID?.() ?? String(Date.now()),
      title: `Conversa ${threads.length + 1}`,
      messages: [
        {
          id: crypto.randomUUID?.() ?? String(Date.now()),
          author: "hot",
          text: "Conversa criada. Como posso ajudar? 🙂",
          timestamp: Date.now(),
        },
      ],
    };
    setThreads(prev => [n, ...prev]);
    setActiveId(n.id);
  }
  function toggleFavorite(id: string) {
    setThreads(prev => prev.map(t => (t.id === id ? { ...t, favorite: !t.favorite } : t)));
  }
  function deleteThread(id: string) {
    const rest = threads.filter(t => t.id !== id);
    setThreads(rest);
    if (id === activeId) setActiveId(rest[0]?.id ?? "");
  }
  function send() {
    const text = input.trim();
    if (!text || !active) return;
    const msg: Message = { id: crypto.randomUUID?.() ?? String(Date.now()), author: "me", text, timestamp: Date.now() };
    setThreads(prev => prev.map(t => (t.id === active.id ? { ...t, messages: [...t.messages, msg] } : t)));
    setInput("");
    setTimeout(() => {
      const reply: Message = { id: crypto.randomUUID?.() ?? String(Date.now()+1), author: "hot", text: "Anotado! 🔥", timestamp: Date.now() };
      setThreads(prev => prev.map(t => (t.id === active.id ? { ...t, messages: [...t.messages, reply] } : t)));
    }, 350);
  }
  function clearAll() {
    if (!confirm("Limpar todas as conversas?")) return;
    setThreads([]);
    localStorage.removeItem(STORAGE_KEY);
    newThread();
  }

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-200">
      {/* SIDEBAR — sem caixas */}
      <aside className="hidden md:flex w-[280px] h-full flex-col">
        {/* topo (botão pílula) */}
        <div className="p-3 sticky top-0 z-10 bg-zinc-950/80 backdrop-blur">
          <button
            onClick={newThread}
            className="w-full text-sm px-4 py-2 rounded-full text-white hover:opacity-90"
            style={{ backgroundColor: ORANGE }}
          >
            + Novo chat
          </button>
        </div>

        {/* busca (pílula) */}
        <div className="px-3 pb-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar conversa"
            className="w-full px-4 py-2 rounded-full bg-white/5 outline-none focus:bg-white/10 transition text-sm"
          />
        </div>

        {/* lista sem cartões */}
        <div className="flex-1 overflow-auto px-2 pb-3 space-y-1">
          {filteredThreads.map(t => (
            <div key={t.id} className="flex items-center gap-2">
              <div className="flex-1">
                <ConversationItem
                  conv={t as any}
                  isActive={t.id === activeId}
                  onClick={() => setActiveId(t.id)}
                />
              </div>
              {/* ações “ghost”, sem borda/caixa */}
              <button
                onClick={() => toggleFavorite(t.id)}
                className={`text-xs px-2 py-1 rounded-full hover:bg-white/5 ${t.favorite ? "text-orange-400" : "text-zinc-400"}`}
                title="Favoritar"
              >
                ★
              </button>
              <button
                onClick={() => deleteThread(t.id)}
                className="text-xs px-2 py-1 rounded-full hover:bg-white/5 text-red-400"
                title="Excluir"
              >
                Excluir
              </button>
            </div>
          ))}
        </div>

        {/* rodapé “limpo” */}
        <div className="p-3 sticky bottom-0 bg-zinc-950/80 backdrop-blur">
          <button
            onClick={clearAll}
            className="w-full text-sm px-4 py-2 rounded-full bg-white/5 hover:bg-white/10"
          >
            Limpar todas
          </button>
        </div>
      </aside>

      {/* ÁREA DO CHAT */}
      <main className="flex-1 h-full flex flex-col">
        {/* topbar sem barra/caixa */}
        <div className="h-14 px-4 flex items-center justify-between sticky top-0 z-10 bg-zinc-950/80 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full grid place-items-center text-white" style={{ backgroundColor: ORANGE }}>
              <span className="text-xs font-bold">HB</span>
            </div>
            <div>
              <p className="font-semibold leading-4">Hot Bertho • online</p>
              {/* se quiser, dá pra por o primeiro conteúdo da conversa ativa aqui */}
            </div>
          </div>
        </div>

        {/* mensagens (só bolhas, sem cards) */}
        <div className="flex-1 overflow-auto p-4 space-y-2">
          {active?.messages.map(m => (
            <Bubble key={m.id} author={m.author} text={m.text} timestamp={m.timestamp} />
          ))}
        </div>

        {/* input em pílula */}
        <div className="p-3 bg-zinc-950/80 backdrop-blur">
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => (e.key === "Enter" ? send() : undefined)}
              placeholder="Escreva sua mensagem…"
              className="flex-1 px-5 py-3 rounded-full outline-none bg-white/5 focus:bg-white/10"
            />
            <button
              onClick={send}
              className="px-5 py-3 rounded-full text-white hover:opacity-90"
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
  const me   = author === "me";
  const time = new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return (
    <div className={`flex ${me ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] px-4 py-2 text-sm rounded-2xl shadow`}
        style={ me
          ? { backgroundColor: ORANGE, color: "#fff" }
          : { backgroundColor: "rgba(255,255,255,0.06)", color: "rgb(229,231,235)" }
        }
      >
        <p className="whitespace-pre-wrap">{text}</p>
        <span className="block text-[10px] mt-1 opacity-80">{time}</span>
      </div>
    </div>
  );
}
