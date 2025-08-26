// app/hub/page.tsx
import NextDynamic from "next/dynamic"; // <-- renomeei o import

// carrega o componente só no cliente (sem SSR)
const ChatHub = NextDynamic(() => import("@/components/chat/ChatHub"), { ssr: false });

export const dynamic = "force-dynamic"; // ok manter esse nome aqui
export const revalidate = 0;

export default function HubPage() {
  return <ChatHub />;
}
