// --- helper + componente inline (cole acima do Sidebar) ---
function sanitize(raw: string) {
  return (raw ?? "")
    .replace(/<[^>]+>/g, "")    // remove HTML
    .replace(/[*_#>`~\-]/g, "") // remove markdown simples
    .replace(/\s+/g, " ")
    .trim();
}

function getFirstText(conv: any) {
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

function ConversationItem({
  conv,
  isActive,
  onClick,
}: {
  conv: any;
  isActive?: boolean;
  onClick?: () => void;
}) {
  const preview = getFirstText(conv);

  return (
    <button
      onClick={onClick}
      className={[
        "w-full text-left rounded-md px-3 py-2 transition",
        isActive ? "bg-[#333333] text-white" : "text-zinc-200 hover:bg-zinc-800/60",
      ].join(" ")}
      title={preview}
    >
      {/* só o primeiro conteúdo, sem título */}
      <p className="text-sm leading-5 overflow-hidden text-ellipsis whitespace-nowrap">
        {preview}
      </p>
    </button>
  );
}
// --- fim do bloco inline ---

import ChatHub from '../components/ChatHub';

export default function Home() {
  return <ChatHub />; // layout e dark já são controlados pelo componente
}
