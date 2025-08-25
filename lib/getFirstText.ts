// lib/getFirstText.ts
type AnyConv = {
  messages?: Array<{ content?: string }>;
  firstMessage?: { content?: string };
  lastMessage?: string;
  preview?: string;
  message?: string;
  snippet?: string;
};

function sanitize(raw: string) {
  return (raw ?? "")
    .replace(/<[^>]+>/g, "")    // remove HTML
    .replace(/[*_#>`~\-]/g, "") // markdown simples
    .replace(/\s+/g, " ")
    .trim();
}

export function getFirstText(conv: AnyConv) {
  const raw =
    conv?.messages?.[0]?.content ??
    conv?.firstMessage?.content ??
    conv?.lastMessage ??
    conv?.preview ??
    conv?.message ??
    conv?.snippet ??
    "";

  const text = sanitize(raw);
  return text || "Sem conteúdo";
}
