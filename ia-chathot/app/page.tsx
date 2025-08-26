// app/page.tsx  (Server Component)
import ChatHub from "@/components/chat/ChatHub"; // ChatHub é "use client"

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function Home() {
  return <ChatHub />;
}
