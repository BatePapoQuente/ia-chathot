export default function Footer() {
  return (
    <footer className="mt-16 border-t">
      <div className="max-w-6xl mx-auto px-4 py-10 text-sm text-gray-500">
        © {new Date().getFullYear()} Minha Web. Todos os direitos reservados.
      </div>
    </footer>
  );
}