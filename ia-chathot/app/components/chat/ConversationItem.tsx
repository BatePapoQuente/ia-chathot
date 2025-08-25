// app/components/chat/ConversationItem.tsx
"use client";
import { getFirstText, type ConvLike } from "../../lib/getFirstText";
// se der erro no alias, troque por: ../../../lib/getFirstText

type Props = { conv: ConvLike; isActive?: boolean; onClick?: () => void };

export default function ConversationItem({ conv, isActive, onClick }: Props) {
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
      <p className="text-sm leading-5 overflow-hidden text-ellipsis whitespace-nowrap">
        {preview}
      </p>
    </button>
  );
}
