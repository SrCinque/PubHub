import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p className="footer-content">Desenvolvido com ❤️ por Filipe Cinque</p>
        <div className="footer-links">
          <Link href="#" className="footer-link">
            Política de Privacidade
          </Link>
          <Link href="#" className="footer-link">
            Termos de Serviço
          </Link>
        </div>
      </div>
    </footer>
  );
}
