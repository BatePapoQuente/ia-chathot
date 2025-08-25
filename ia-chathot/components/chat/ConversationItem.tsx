"use client";

import { getFirstText, type ConvLike } from "../../lib/getFirstText";

type Props = {
  conv: ConvLike;
  isActive?: boolean;
  onClick?: () => void;
};

export default function ConversationItem({ conv, isActive, onClick }: Props) {
  const preview = getFirstText(conv);

  return (
    <button
      onClick={onClick}
      className={[
        "group relative w-full text-left px-4 py-2 rounded-full transition",
        isActive ? "bg-white/10 text-white" : "hover:bg-white/5 text-zinc-200",
      ].join(" ")}
      title={preview}
    >
      {/* indicador sutil da ativa (sem retângulo) */}
      <span
        className={[
          "absolute left-2 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full",
          isActive ? "bg-orange-500" : "bg-transparent group-hover:bg-zinc-500/60",
        ].join(" ")}
      />
      <span className="pl-3 text-sm leading-5 overflow-hidden text-ellipsis whitespace-nowrap">
        {preview}
      </span>
    </button>
  );
}
