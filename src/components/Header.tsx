import Link from "next/link";
import { cookies } from "next/headers";
import db from "@/infra/db";
import { LogoutButton } from "./LogoutButton";

export default async function Header() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  // Se não houver session_token, usuário está deslogado
  if (!sessionToken || typeof sessionToken !== "string") {
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
            <Link href="/signup" className="navbar-action-btn">
              Cadastrar
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  // Se houver session_token válido, buscar os dados do usuário
  let userName: string | null = null;
  try {
    const session = await db.session.findUnique({
      where: { sessionToken },
      include: { user: true },
    });

    if (session?.user) {
      userName = session.user.name || session.user.email;
    }
  } catch (error) {
    console.error("Erro ao buscar dados da sessão:", error);
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link href="/" className="flex items-center gap-2 cursor-pointer">
          <div className="navbar-logo-icon">P</div>
          <span className="navbar-logo-text">PubHub</span>
        </Link>

        <div className="navbar-actions items-center gap-4">
          <Link href="/perfil" className="navbar-action-btn whitespace-nowrap">
            {userName || "Perfil"}
          </Link>
          <LogoutButton />
        </div>

      </div>
    </nav>
  );
}
