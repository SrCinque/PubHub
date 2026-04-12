import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-[var(--border-green)]/30 bg-[var(--bg-dark)] py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--primary-green-light)] to-[var(--primary-green)] flex items-center justify-center text-[var(--text-dark)] font-bold text-xl group-hover:scale-110 transition-transform">
                P
              </div>
              <span className="text-2xl font-bold text-[var(--primary-green-light)]">PubHub</span>
            </Link>
            <p className="text-[var(--text-muted)] max-w-sm leading-relaxed">
              A solução definitiva para distribuição e automação de conteúdo em massa. 
              Simplifique seu workflow e alcance mais pessoas.
            </p>
          </div>

          {/* Links Section 1 */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Produto</h4>
            <ul className="space-y-4 text-[var(--text-muted)]">
              <li><Link href="#" className="hover:text-[var(--primary-green-light)] transition-colors">Funcionalidades</Link></li>
              <li><Link href="#" className="hover:text-[var(--primary-green-light)] transition-colors">Preços</Link></li>
              <li><Link href="#" className="hover:text-[var(--primary-green-light)] transition-colors">Integrações</Link></li>
            </ul>
          </div>

          {/* Links Section 2 */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Suporte</h4>
            <ul className="space-y-4 text-[var(--text-muted)]">
              <li><Link href="#" className="hover:text-[var(--primary-green-light)] transition-colors">Central de Ajuda</Link></li>
              <li><Link href="#" className="hover:text-[var(--primary-green-light)] transition-colors">Privacidade</Link></li>
              <li><Link href="#" className="hover:text-[var(--primary-green-light)] transition-colors">Termos</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-[var(--border-green)]/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-[var(--text-muted)]">
          <p>© {currentYear} PubHub - Desenvolvido por Filipe Cinque para TCC.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-white transition-colors">LinkedIn</Link>
            <Link href="#" className="hover:text-white transition-colors">GitHub</Link>
            <Link href="#" className="hover:text-white transition-colors">Instagram</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
