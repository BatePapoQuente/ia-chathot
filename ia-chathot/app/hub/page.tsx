import ChatHub from "@/components/chat/ChatHub"; 

export const dynamic = "force-dynamic"; 
export const revalidate = 0;           

export default function HubPage() {
  return <ChatHub />;
}
