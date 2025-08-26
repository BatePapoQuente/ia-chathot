// app/hub/page.tsx  (Server Component)
import ChatHub from "@/components/chat/ChatHub"; // ChatHub é "use client"

export const dynamic = "force-dynamic"; // evita SSG
export const revalidate = 0;             // sem cache

export default function HubPage() {
  return <ChatHub />;
}
