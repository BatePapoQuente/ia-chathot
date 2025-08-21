export const metadata = {
  title: "ia-chathot",
  description: "Site de suporte inteligente de atendimento ao cliente",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
