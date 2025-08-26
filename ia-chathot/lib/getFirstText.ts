// lib/getFirstText.ts
export type ConvLike = {
  id?: string | number;
  messages?: Array<{ text?: string | null; content?: string | null; author?: string | null }>;
  firstMessage?: { text?: string | null; content?: string | null; author?: string | null };
  lastMessage?: string | null;
  preview?: string | null;
  message?: string | null;
  snippet?: string | null;
};

function sanitize(s: string) {
  return (s ?? "")
    .replace(/<[^>]+>/g, "")
    .replace(/[*_#>`~\-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Primeiro texto visível (de qualquer lado). */
export function getFirstText(conv: ConvLike): string {
  const raw =
    conv?.messages?.[0]?.text ??
    conv?.messages?.[0]?.content ??
    conv?.firstMessage?.text ??
    conv?.firstMessage?.content ??
    conv?.preview ??
    conv?.message ??
    conv?.snippet ??
    conv?.lastMessage ??
    "";
  const txt = sanitize(String(raw ?? ""));
  return txt || "Sem conteúdo";
}

/** Primeira mensagem do usuário (author: "me"/"user"/"owner"). */
export function getFirstUserText(conv: ConvLike): string {
  const msgs = conv?.messages ?? [];
  const me = msgs.find(m => ["me", "user", "owner"].includes(String(m?.author ?? "").toLowerCase()));
  const raw = me?.text ?? me?.content ?? "";
  return sanitize(String(raw ?? ""));
}
