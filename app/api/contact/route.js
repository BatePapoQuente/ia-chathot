export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, message } = body || {};

    if (!name || !email || !message) {
      return Response.json({ error: "Campos obrigatórios: name, email, message." }, { status: 400 });
    }

    // Aqui você poderia enviar e-mail, salvar no banco, etc.
    // Exemplo: console.log para visualizar no terminal
    console.log("Novo contato:", { name, email, message });

    return Response.json({ ok: true });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Erro ao processar." }, { status: 500 });
  }
}
