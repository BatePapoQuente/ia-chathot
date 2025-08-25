export type ConvLike =
  | { messages?: Array<{ content?: string | null }>; id?: string | number }
  | { firstMessage?: { content?: string | null }; id?: string | number }
  | { lastMessage?: string | null; id?: string | number }
  | { preview?: string | null; id?: string | number }
  | { message?: string | null; id?: string | number }
  | { snippet?: string | null; id?: string | number }
  | { id?: string | number };

function sanitize(raw: string) {
  return (raw ?? "")
    .replace(/<[^>]+>/g, "")      // remove HTML
    .replace(/[*_#>`~\-]/g, "")   // limpa markdown básico
    .replace(/\s+/g, " ")
    .trim();
}

export function getFirstText(conv: ConvLike): string {
  const raw =
    (conv as any)?.messages?.[0]?.content ??
    (conv as any)?.firstMessage?.content ??
    (conv as any)?.lastMessage ??
    (conv as any)?.preview ??
    (conv as any)?.message ??
    (conv as any)?.snippet ??
    "";

  const txt = sanitize(String(raw ?? ""));
  return txt || "Sem conteúdo";
}
