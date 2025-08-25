// components/ConversationItem.tsx
import { getFirstText } from "@/lib/getFirstText";

type Conversation = {
  id: string | number;
  messages?: Array<{ content?: string }>;
};

export function ConversationItem({
  conv,
  isActive,
  onClick,
}: {
  conv: Conversation;
  isActive?: boolean;
  onClick?: () => void;
}) {
  const preview = getFirstText(conv);

  return (
    <button
      onClick={onClick}
      className={[
        "w-full text-left rounded-md px-3 py-2 transition",
        isActive
          ? "bg-[#333333] text-white"
          : "text-zinc-200 hover:bg-zinc-800/60",
      ].join(" ")}
      title={preview}
    >
      <p className="text-sm leading-5 overflow-hidden text-ellipsis whitespace-nowrap">
        {preview}
      </p>
    </button>
  );
}
