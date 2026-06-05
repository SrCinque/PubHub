import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LogoutButton } from "@/components/LogoutButton";
import { ClientProfileForm } from "@/components/ClientProfileForm";

export default async function PerfilPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  if (!sessionToken) {
    redirect("/login");
  }

  let userData = null;
  let error: Error | null = null;

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const response = await fetch(`${apiUrl}/api/v1/user`, {
      method: "GET",
      headers: {
        Cookie: `session_token=${sessionToken}`,
      },
      cache: "no-store",
    });

    if (response.ok) {
      userData = await response.json();
    } else if (response.status === 401) {
      error = new Error("Sessão expirada");
    } else {
      error = new Error("Erro ao buscar usuário");
    }
  } catch (err) {
    console.error("Erro ao buscar dados do usuário:", err);
    error = err instanceof Error ? err : new Error("Erro desconhecido");
  }

  // Redirecionar apenas após o try-catch
  if (!userData || error) {
    redirect("/login");
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[var(--bg-darker)] p-12">
      <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-500">
        <header>
          <h1 className="text-4xl font-bold text-white mb-2">
            Configurações de Perfil
          </h1>
          <p className="text-[var(--text-muted)]">
            Gerencie suas informações pessoais e preferências de conta no
            PubHub.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-8">
          <section className="bg-[var(--bg-dark)] border border-[var(--border-green)] rounded-xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-[var(--border-green)]/30 bg-[var(--primary-green)]/5">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                Informações da Conta
              </h2>
            </div>
            <div className="p-8">
              <ClientProfileForm userData={userData} />
            </div>
          </section>

          <section className="bg-red-500/5 border border-red-500/20 rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">
                Zona de Perigo
              </h3>
              <p className="text-sm text-[var(--text-muted)]">
                Ao sair da conta, você precisará se autenticar novamente para
                acessar o dashboard.
              </p>
            </div>
            <LogoutButton className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-semibold shadow-lg shadow-red-600/20 active:scale-95 whitespace-nowrap">
              Sair da Conta
            </LogoutButton>
          </section>
        </div>
      </div>
    </div>
  );
}
