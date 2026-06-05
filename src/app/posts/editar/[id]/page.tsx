import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { postService } from "@/services/postService";
import { PostForm } from "@/components/PostForm";

interface EditPostPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params;
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  if (!sessionToken) {
    redirect("/login");
  }

  let post = null;

  try {
    post = await postService.getById(id, sessionToken);
  } catch (error) {
    console.error(`Erro ao buscar post ${id}:`, error);
    notFound();
  }

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[var(--bg-darker)] p-8 md:p-12">
      <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <header className="space-y-2">
          <h1 className="text-4xl font-bold text-white">Editar Post</h1>
          <p className="text-[var(--text-muted)]">
            Altere as informações do seu post abaixo.
          </p>
        </header>

        <section className="bg-[var(--bg-dark)] border border-[var(--border-green)]/20 rounded-2xl p-8 shadow-2xl">
          <PostForm post={post} />
        </section>
      </div>
    </div>
  );
}
