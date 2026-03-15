import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LogoutButton } from "@/components/LogoutButton";

export default async function PerfilPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  if (!sessionToken) {
    redirect("/login");
  }

  let userData = null;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/v1/user`,
      {
        method: "GET",
        headers: {
          Cookie: `session_token=${sessionToken}`,
        },
        cache: "no-store",
      },
    );

    if (response.ok) {
      userData = await response.json();
    } else if (response.status === 401) {
      redirect("/login");
    }
  } catch (error) {
    console.error("Erro ao buscar dados do usuário:", error);
    redirect("/login");
  }

  if (!userData) {
    redirect("/login");
  }

  const dataCriacao = userData?.createdAt
    ? new Date(userData.createdAt).toLocaleDateString("pt-BR")
    : "N/A";

  return (
    <div className="min-h-screen bg-grid">
      <section className="section py-24 flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="login-form-container">
          <div className="login-form-wrapper">
            <div className="login-form-header">
              <h1 className="login-form-title">Meu Perfil</h1>
              <p className="login-form-subtitle">
                Informacoes da sua conta PubHub
              </p>
            </div>

            <div className="login-form" style={{ gap: "1.5rem" }}>
              <div className="login-form-group">
                <label className="login-form-label">Nome</label>
                <div
                  className="login-form-input"
                  style={{
                    padding: "1rem 1.5rem",
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(107, 114, 128, 0.3)",
                  }}
                >
                  <p style={{ margin: 0, color: "white" }}>
                    {userData?.name || "Nao informado"}
                  </p>
                </div>
              </div>

              <div className="login-form-group">
                <label className="login-form-label">E-mail</label>
                <div
                  className="login-form-input"
                  style={{
                    padding: "1rem 1.5rem",
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(107, 114, 128, 0.3)",
                  }}
                >
                  <p style={{ margin: 0, color: "white" }}>{userData?.email}</p>
                </div>
              </div>

              <div className="login-form-group">
                <label className="login-form-label">Membro desde</label>
                <div
                  className="login-form-input"
                  style={{
                    padding: "1rem 1.5rem",
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(107, 114, 128, 0.3)",
                  }}
                >
                  <p style={{ margin: 0, color: "white" }}>{dataCriacao}</p>
                </div>
              </div>

              <div className="login-form-group">
                <label className="login-form-label">
                  Status de Verificacao
                </label>
                <div
                  className="login-form-input"
                  style={{
                    padding: "1rem 1.5rem",
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(107, 114, 128, 0.3)",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      color: userData?.emailVerified
                        ? "var(--primary-green-light)"
                        : "#fca5a5",
                    }}
                  >
                    {userData?.emailVerified ? "Verificado" : "Nao verificado"}
                  </p>
                </div>
              </div>
            </div>

            <div style={{ marginTop: "2rem" }}>
              <LogoutButton
                className="btn btn-primary w-full justify-center py-4 text-lg font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-[var(--primary-green)]/25"
                style={{ background: "#ef4444" }}
              >
                Sair da Conta
              </LogoutButton>
            </div>

            <div className="login-signup-section">
              <Link href="/" className="login-signup-link">
                Voltar ao inicio
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
