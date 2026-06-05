"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { postService, Post } from "@/services/postService";

interface PostFormProps {
  post?: Post;
}

export function PostForm({ post }: PostFormProps) {
  const router = useRouter();
  const [content, setContent] = useState(post?.content || "");
  const [imageUrl, setImageUrl] = useState(post?.imageUrl || "");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(post?.imageUrl || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!post;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const removeImage = () => {
    setFile(null);
    setPreview(null);
    setImageUrl("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("content", content);
      if (file) {
        formData.append("file", file);
      } else {
        formData.append("imageUrl", imageUrl || "");
      }

      if (isEditing) {
        await postService.update(post.id, formData);
      } else {
        await postService.create(formData);
      }
      router.push("/posts");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Erro ao salvar post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm">
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="content"
          className="block text-sm font-medium text-[var(--text-muted)] mb-2"
        >
          Conteúdo do Post
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={5}
          className="w-full bg-[var(--bg-darker)] border border-[var(--border-green)]/30 rounded-lg p-4 text-white focus:outline-none focus:border-[var(--primary-green)] transition-all resize-none"
          placeholder="O que você está pensando?"
        />
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-[var(--text-muted)]">
          Imagem do Post
        </label>
        
        <div className="flex flex-col gap-4">
          {preview ? (
            <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-[var(--border-green)]/30 bg-[var(--bg-darker)]">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-contain"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all shadow-lg"
                title="Remover imagem"
              >
                ✕
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[var(--border-green)]/30 rounded-lg cursor-pointer hover:bg-white/5 transition-all">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <span className="text-2xl mb-2">📁</span>
                  <p className="text-xs text-[var(--text-muted)]">
                    Clique para fazer upload
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>

              <div className="flex flex-col justify-center">
                <p className="text-xs text-[var(--text-muted)] mb-2 text-center">OU use uma URL</p>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full bg-[var(--bg-darker)] border border-[var(--border-green)]/30 rounded-lg p-3 text-white focus:outline-none focus:border-[var(--primary-green)] transition-all text-sm"
                  placeholder="https://exemplo.com/imagem.jpg"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-[var(--primary-green)] text-[var(--text-dark)] font-bold py-3 px-6 rounded-lg hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Salvando..." : isEditing ? "Atualizar Post" : "Criar Post"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/posts")}
          className="px-6 py-3 border border-[var(--border-green)]/30 text-[var(--text-muted)] rounded-lg hover:bg-white/5 transition-all"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
