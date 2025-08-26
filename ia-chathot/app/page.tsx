// app/page.tsx
import NextDynamic from "next/dynamic";

const ChatHub = NextDynamic(() => import("@/components/chat/ChatHub"), { ssr: false });

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function Home() {
  return <ChatHub />;
}
