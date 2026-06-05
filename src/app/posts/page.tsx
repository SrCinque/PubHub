import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { postService } from "@/services/postService";
import { PostCard } from "@/components/PostCard";

export default async function PostsPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  if (!sessionToken) {
    redirect("/login");
  }

  let posts = [];
  let userData = null;

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    
    // Fetch posts and user data in parallel
    const [postsRes, userRes] = await Promise.all([
      postService.getAll(sessionToken),
      fetch(`${apiUrl}/api/v1/user`, {
        headers: { Cookie: `session_token=${sessionToken}` },
        cache: "no-store",
      }).then(res => res.ok ? res.json() : null)
    ]);

    posts = postsRes;
    userData = userRes;
  } catch (error) {
    console.error("Erro ao carregar dados da página de posts:", error);
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[var(--bg-darker)] p-8 md:p-12">
      <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-white">Posts</h1>
            <p className="text-[var(--text-muted)]">
              Gerencie e visualize todas as suas publicações no PubHub.
            </p>
          </div>
          
          <Link
            href="/posts/novo"
            className="flex items-center justify-center gap-2 bg-[var(--primary-green)] text-[var(--text-dark)] font-bold py-3 px-8 rounded-xl hover:brightness-110 transition-all shadow-lg shadow-[var(--primary-green)]/10 active:scale-95 whitespace-nowrap"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Novo Post
          </Link>
        </header>

        {posts.length === 0 ? (
          <div className="bg-[var(--bg-dark)] border border-[var(--border-green)]/20 rounded-2xl p-20 flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-[var(--primary-green)]/5 border border-[var(--border-green)]/20 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-[var(--text-muted)]"
              >
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-white">Nenhum post encontrado</h3>
              <p className="text-[var(--text-muted)] max-w-sm">
                Você ainda não criou nenhum post. Comece agora mesmo clicando no botão acima!
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {posts.map((post: any) => (
              <PostCard 
                key={post.id} 
                post={post} 
                currentUserId={userData?.id} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
