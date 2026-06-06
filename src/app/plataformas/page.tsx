import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { postService } from "@/services/postService";

export default async function PlataformasPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  if (!sessionToken) {
    redirect("/login");
  }

  let posts = [];
  try {
    // Para simplificar, vamos buscar todos os posts e depois o front-end pode filtrar ou mostrar o status
    // Idealmente teríamos um endpoint que já traz os posts com o status das plataformas
    posts = await postService.getAll(sessionToken);
  } catch (error) {
    console.error("Erro ao buscar posts para o módulo de plataformas:", error);
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[var(--bg-darker)] p-8 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-white">Central de Plataformas</h1>
            <p className="text-[var(--text-muted)]">
              Gerencie e monitore a publicação de seus posts em múltiplas redes sociais.
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card de Resumo 1 */}
          <div className="bg-[var(--bg-dark)] border border-[var(--border-green)]/20 rounded-2xl p-6 space-y-2">
            <p className="text-[var(--text-muted)] text-sm uppercase tracking-wider font-bold">Total de Posts</p>
            <p className="text-3xl font-bold text-white">{posts.length}</p>
          </div>
          {/* Card de Resumo 2 */}
          <div className="bg-[var(--bg-dark)] border border-[var(--border-green)]/20 rounded-2xl p-6 space-y-2">
            <p className="text-[var(--text-muted)] text-sm uppercase tracking-wider font-bold">Plataformas Ativas</p>
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-[var(--primary-green)]/10 border border-[var(--border-green)]/30 rounded text-[10px] text-[var(--primary-green)] font-bold">LINKEDIN</span>
              <span className="px-2 py-1 bg-[var(--primary-green)]/10 border border-[var(--border-green)]/30 rounded text-[10px] text-[var(--primary-green)] font-bold">REDDIT</span>
            </div>
          </div>
        </div>

        <section className="bg-[var(--bg-dark)] border border-[var(--border-green)]/20 rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-[var(--border-green)]/10 bg-white/5">
            <h2 className="text-xl font-semibold text-white">Publicações Recentes</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--border-green)]/10">
                  <th className="p-4 text-xs uppercase tracking-wider font-bold text-[var(--text-muted)]">Post</th>
                  <th className="p-4 text-xs uppercase tracking-wider font-bold text-[var(--text-muted)]">Data</th>
                  <th className="p-4 text-xs uppercase tracking-wider font-bold text-[var(--text-muted)]">Canais</th>
                  <th className="p-4 text-xs uppercase tracking-wider font-bold text-[var(--text-muted)]">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-green)]/5">
                {posts.map((post: any) => (
                  <tr key={post.id} className="hover:bg-white/5 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {post.imageUrl && (
                          <img src={post.imageUrl} alt="" className="w-10 h-10 rounded object-cover border border-[var(--border-green)]/20" />
                        )}
                        <p className="text-white text-sm line-clamp-1 max-w-[300px]">{post.content}</p>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-[var(--text-muted)]">
                      {new Date(post.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        {/* Aqui poderíamos mostrar os ícones das plataformas se tivéssemos os dados no fetch inicial */}
                        <span className="text-[10px] text-[var(--text-muted)] italic">Acesse para gerenciar</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <Link
                        href={`/plataformas/${post.id}`}
                        className="inline-flex items-center gap-2 bg-[var(--primary-green)]/10 hover:bg-[var(--primary-green)] text-[var(--primary-green)] hover:text-[var(--text-dark)] px-4 py-2 rounded-lg text-sm font-bold transition-all"
                      >
                        Gerenciar Destinos
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
                      </Link>
                    </td>
                  </tr>
                ))}
                {posts.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-12 text-center text-[var(--text-muted)]">
                      Nenhum post encontrado para gerenciar.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
