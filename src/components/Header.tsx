import Link from "next/link";

export default function Header() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link href="/" className="flex items-center gap-2 cursor-pointer">
          <div className="navbar-logo-icon">P</div>
          <span className="navbar-logo-text">PubHub</span>
        </Link>

        <div className="navbar-actions">
          <Link href="/login" className="navbar-action-btn">
            Entrar
          </Link>
        </div>
      </div>
    </nav>
  );
}
