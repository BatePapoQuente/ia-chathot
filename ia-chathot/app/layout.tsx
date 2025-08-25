// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ia-chathot",
  description: "Site de suporte inteligente de atendimento ao cliente",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-black text-zinc-200 antialiased">
        {children}
      </body>
    </html>
  );
}
