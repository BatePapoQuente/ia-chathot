"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import ConversationItem from "./ConversationItem";
import ConfirmDialog from "./ConfirmDialog";
import { getFirstUserText } from "@/lib/getFirstText";

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
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);

  // carregar/salvar histórico
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed: Thread[] = JSON.parse(raw);
      setThreads(parsed);
      setActiveId(parsed[0]?.id ?? "");
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

  // mensagens da conversa ativa em ordem DESC (mais recentes primeiro)
  const messagesDesc = useMemo(() => {
    const msgs = active?.messages ?? [];
    return [...msgs].sort((a, b) => b.timestamp - a.timestamp);
  }, [active?.messages]);

  function newThread() {
    const n: Thread = {
      id: crypto.randomUUID?.() ?? String(Date.now()),
      title: `Conversa ${threads.length + 1}`,
      messages: [],
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
  if (!text) return;

    let id = active?.id;
    if (!id) {
      const n: Thread = {
        id: crypto.randomUUID?.() ?? String(Date.now()),
        title: `Conversa ${threads.length + 1}`,
        messages: [],
      };
      setThreads(prev => [n, ...prev]);
      setActiveId(n.id);
      id = n.id;
    }
 
    const msg: Message = { id: crypto.randomUUID?.() ?? String(Date.now()), author: "me", text, timestamp: Date.now() };
      setThreads(prev => prev.map(t => (t.id === id ? { ...t, messages: [...t.messages, msg] } : t)));
      setInput("");
      setTimeout(() => {
      const reply: Message = { id: crypto.randomUUID?.() ?? String(Date.now() + 1), author: "hot", text: "Anotado! 🔥", timestamp: Date.now() };
      setThreads(prev => prev.map(t => (t.id === id ? { ...t, messages: [...t.messages, reply] } : t)));
    }, 350);
  }
  function clearAll() {
    setThreads([]);
    localStorage.removeItem(STORAGE_KEY);
    setActiveId("");
  }

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-200 overflow-x-hidden">
      {/* SIDEBAR — sem caixas */}
      <aside className="hidden md:flex w-[280px] h-full flex-col overflow-x-hidden">
      {/* menu colapsado */}
        <div className="p-3">
          <button
            onClick={() => setMenuOpen(o => !o)}
            className="w-full text-sm px-4 py-2 rounded-full bg-white/5 hover:bg-white/10"
          >
          Menu
          </button>
        {menuOpen && (
            <div className="mt-2 space-y-2">
              <button
                onClick={newThread}
                className="w-full text-sm px-4 py-2 rounded-full text-white hover:opacity-90"
                style={{ backgroundColor: ORANGE }}
              >
                + Novo chat
              </button>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar conversa"
                className="w-full px-4 py-2 rounded-full bg-white/5 outline-none focus:bg-white/10 transition text-sm"
              />
            </div>
          )}
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
            onClick={() => setConfirmOpen(true)}
            className="w-full text-sm px-4 py-2 rounded-full bg-white/5 hover:bg-white/10"
          >
            Limpar todas as conversas
          </button>
        </div>
      </aside>

      {/* ÁREA DO CHAT */}
      <main className="flex-1 h-full flex flex-col">
        {/* topbar */}
        {active && active.messages.length > 0 && (
          <div className="h-14 px-4 flex items-center justify-between sticky top-0 z-10 bg-zinc-950/80 backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full grid place-items-center text-white" style={{ backgroundColor: ORANGE }}>
                <span className="text-xs font-bold">HB</span>
              </div>
              <div>
                <p className="font-semibold leading-4"> {getFirstUserText(active as any) || "Sem conteúdo"} </p>
              </div>
            </div>
          </div>
        )}

        {/* mensagens */}
        <div ref={listRef} className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden">
          {active && active.messages.length > 0 ? (
            <div className="p-4 space-y-2">
              {messagesDesc.map(m => (
                <Bubble key={m.id} author={m.author} text={m.text} timestamp={m.timestamp} />
              ))}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <h1 className="text-4xl font-bold">Prazer, Maia</h1>
            </div>
          )}
        </div>

        {/* input em pílula */}
        <div className="p-3 bg-zinc-950/80 backdrop-blur">
        <div className="flex gap-2 min-w-0 max-w-2xl mx-auto">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => (e.key === "Enter" ? send() : undefined)}
              placeholder="Escreva sua mensagem…"
              className="flex-1 min-w-0 px-5 py-3 rounded-full outline-none bg-white/5 focus:bg-white/10"
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

      {confirmOpen && (
        <ConfirmDialog
          message="Limpar todas as conversas?"
          onConfirm={() => {
            clearAll();
            setConfirmOpen(false);
          }}
          onCancel={() => setConfirmOpen(false)}
        />
      )}
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
        <p className="whitespace-pre-wrap break-words">{text}</p>
        <span className="block text-[10px] mt-1 opacity-80">{time}</span>
      </div>
    </div>
  );
}
