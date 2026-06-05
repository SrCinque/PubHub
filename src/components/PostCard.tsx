"use client";

import { Post, postService } from "@/services/postService";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface PostCardProps {
  post: Post;
  currentUserId?: string;
}

export function PostCard({ post, currentUserId }: PostCardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const isAuthor = currentUserId === post.userId;

  const handleDelete = async () => {
    if (!confirm("Tem certeza que deseja deletar este post?")) return;

    setLoading(true);
    try {
      await postService.delete(post.id);
      router.refresh();
    } catch (error) {
      alert("Erro ao deletar post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <article className="bg-[var(--bg-dark)] border border-[var(--border-green)]/20 rounded-xl overflow-hidden hover:border-[var(--border-green)]/50 transition-all group">
      {post.imageUrl && (
        <div className="aspect-video w-full overflow-hidden border-b border-[var(--border-green)]/10">
          <img
            src={post.imageUrl}
            alt="Post image"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}

      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--primary-green)]/10 border border-[var(--border-green)]/30 flex items-center justify-center overflow-hidden">
              {post.user.image ? (
                <img
                  src={post.user.image}
                  alt={post.user.name || "User"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-[var(--primary-green)] font-bold">
                  {(post.user.name || post.user.email)[0].toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <p className="text-white font-medium">
                {post.user.name || post.user.email}
              </p>
              <p className="text-xs text-[var(--text-muted)]">
                {new Date(post.createdAt).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          {isAuthor && (
            <div className="flex items-center gap-2">
              <Link
                href={`/posts/editar/${post.id}`}
                className="p-2 text-[var(--text-muted)] hover:text-[var(--primary-green)] hover:bg-[var(--primary-green)]/10 rounded-lg transition-all"
                title="Editar"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                  <path d="m15 5 4 4" />
                </svg>
              </Link>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="p-2 text-[var(--text-muted)] hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                title="Deletar"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 6h18" />
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                </svg>
              </button>
            </div>
          )}
        </div>

        <p className="text-[var(--text-muted)] whitespace-pre-wrap leading-relaxed">
          {post.content}
        </p>
      </div>
    </article>
  );
}
