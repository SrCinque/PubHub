import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { postService } from "@/services/postService";
import { PostDestinationsManager } from "@/components/PostDestinationsManager";

interface PostDestinationsPageProps {
  params: Promise<{ id: string }>;
}

export default async function PostDestinationsPage({ params }: PostDestinationsPageProps) {
  const { id } = await params;
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  if (!sessionToken) {
    redirect("/login");
  }

  let post = null;
  let destinations = [];

  try {
    // Fetch post and destinations in parallel
    const [postData, destinationsData] = await Promise.all([
      postService.getById(id, sessionToken),
      postService.getDestinations(id, sessionToken)
    ]);
    
    post = postData;
    destinations = destinationsData;
  } catch (error) {
    console.error(`Erro ao carregar dados do post ${id}:`, error);
    notFound();
  }

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[var(--bg-darker)] p-8 md:p-12">
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <Link 
              href="/posts" 
              className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--primary-green)] transition-colors mb-4 group w-fit"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform"><path d="m15 18-6-6 6-6"/></svg>
              Voltar para Posts
            </Link>
            <h1 className="text-4xl font-bold text-white">Destinos de Publicação</h1>
            <p className="text-[var(--text-muted)]">
              Gerencie para quais plataformas este post será enviado.
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <section className="bg-[var(--bg-dark)] border border-[var(--border-green)]/20 rounded-2xl p-6 shadow-xl sticky top-24">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--primary-green)]"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                Conteúdo do Post
              </h3>
              
              <div className="space-y-4">
                {post.imageUrl && (
                  <div className="aspect-video w-full rounded-xl overflow-hidden border border-[var(--border-green)]/10">
                    <img src={post.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
                <p className="text-[var(--text-muted)] text-sm leading-relaxed whitespace-pre-wrap italic">
                  "{post.content.length > 200 ? post.content.substring(0, 200) + '...' : post.content}"
                </p>
              </div>
            </section>
          </div>

          <div className="lg:col-span-2">
            <section className="bg-[var(--bg-dark)] border border-[var(--border-green)]/20 rounded-2xl p-8 shadow-2xl">
              <PostDestinationsManager postId={id} initialDestinations={destinations} />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
