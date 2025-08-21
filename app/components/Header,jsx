import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-extrabold text-xl">
          Minha<span className="text-gray-500">Web</span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="#contato" className="hover:opacity-80">Contato</Link>
          <a
            href="https://vercel.com"
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border px-4 py-2 hover:bg-gray-50"
          >
            Deploy
          </a>
        </nav>
      </div>
    </header>
  );
}