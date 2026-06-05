import { PostForm } from "@/components/PostForm";

export default function NovoPostPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[var(--bg-darker)] p-8 md:p-12">
      <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <header className="space-y-2">
          <h1 className="text-4xl font-bold text-white">Criar Novo Post</h1>
          <p className="text-[var(--text-muted)]">
            Preencha os campos abaixo para publicar um novo conteúdo no PubHub.
          </p>
        </header>

        <section className="bg-[var(--bg-dark)] border border-[var(--border-green)]/20 rounded-2xl p-8 shadow-2xl">
          <PostForm />
        </section>
      </div>
    </div>
  );
}
