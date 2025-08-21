import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-16">
        <section className="text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Sua nova web em JavaScript, do zero.
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Next.js + Tailwind prontos para construir rápido, bonito e escalável.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link
              href="#contato"
              className="rounded-2xl px-6 py-3 font-semibold bg-black text-white hover:opacity-90"
            >
              Falar com a gente
            </Link>
            <Link
              href="https://nextjs.org/docs"
              target="_blank"
              className="rounded-2xl px-6 py-3 font-semibold border border-gray-300 hover:bg-gray-100"
            >
              Documentação
            </Link>
          </div>
        </section>

        <section className="mt-16 grid gap-6 md:grid-cols-3">
          {[
            { title: "Rápido", desc: "SSR/SSG/ISR prontos pra produção." },
            { title: "Escalável", desc: "Rotas, APIs e assets no mesmo projeto." },
            { title: "Bonito", desc: "Tailwind para estilizar com agilidade." },
          ].map((c) => (
            <article key={c.title} className="rounded-2xl border bg-white p-6 shadow-sm">
              <h3 className="text-xl font-bold">{c.title}</h3>
              <p className="mt-2 text-gray-600">{c.desc}</p>
            </article>
          ))}
        </section>

        <section id="contato" className="mt-20 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold">Contato</h2>
          <p className="text-gray-600 mt-1">Envie uma mensagem de teste para a API.</p>
          <form
            className="mt-6 grid gap-3"
            onSubmit={async (e) => {
              e.preventDefault();
              const form = new FormData(e.currentTarget);
              const payload = {
                name: form.get("name"),
                email: form.get("email"),
                message: form.get("message"),
              };
              const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
              });
              const data = await res.json();
              alert(res.ok ? "Mensagem enviada!" : `Erro: ${data?.error || "Tente novamente"}`);
              e.currentTarget.reset();
            }}
          >
            <input
              name="name"
              placeholder="Seu nome"
              required
              className="rounded-xl border p-3"
            />
            <input
              name="email"
              type="email"
              placeholder="Seu e-mail"
              required
              className="rounded-xl border p-3"
            />
            <textarea
              name="message"
              placeholder="Sua mensagem"
              rows={4}
              required
              className="rounded-xl border p-3"
            />
            <button
              type="submit"
              className="rounded-2xl px-6 py-3 font-semibold bg-black text-white hover:opacity-90"
            >
              Enviar
            </button>
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
}
