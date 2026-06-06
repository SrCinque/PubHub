"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { postService, PostDestination } from "@/services/postService";

interface PostDestinationsManagerProps {
  postId: string;
  initialDestinations: PostDestination[];
}

const PLATFORMS = [
  { id: "LINKEDIN", name: "LinkedIn", icon: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
  )},
  { id: "REDDIT", name: "Reddit", icon: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M17 12a5 5 0 0 1-5 5H11a5 5 0 0 1-5-5 5 5 0 0 1 5-5h1a5 5 0 0 1 5 5z"/><circle cx="12" cy="12" r="2"/></svg>
  )},
  { id: "TWITTER", name: "Twitter / X", icon: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
  )},
  { id: "FACEBOOK", name: "Facebook", icon: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
  )},
];

export function PostDestinationsManager({ postId, initialDestinations }: PostDestinationsManagerProps) {
  const router = useRouter();
  const [destinations, setDestinations] = useState<PostDestination[]>(initialDestinations);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const existingPlatforms = destinations.map(d => d.platform);

  const togglePlatform = (platformId: string) => {
    if (existingPlatforms.includes(platformId)) return;

    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(p => p !== platformId) 
        : [...prev, platformId]
    );
  };

  const handlePublish = async () => {
    if (selectedPlatforms.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      const newDestinations = await postService.createDestinations(postId, selectedPlatforms);
      setDestinations(prev => [...newDestinations, ...prev]);
      setSelectedPlatforms([]);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Erro ao criar destinos de publicação");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SUCCESS": return "text-green-400";
      case "FAILED": return "text-red-400";
      default: return "text-yellow-400";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "SUCCESS": return "Publicado";
      case "FAILED": return "Erro";
      default: return "Pendente";
    }
  };

  return (
    <div className="space-y-12">
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--primary-green)]"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
          Nova Publicação
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {PLATFORMS.map((platform) => {
            const isExisting = existingPlatforms.includes(platform.id);
            const isSelected = selectedPlatforms.includes(platform.id);
            
            return (
              <button
                key={platform.id}
                onClick={() => togglePlatform(platform.id)}
                disabled={isExisting || loading}
                className={`
                  flex flex-col items-center justify-center p-6 rounded-2xl border transition-all space-y-3
                  ${isExisting 
                    ? "bg-[var(--bg-darker)] border-[var(--border-green)]/10 opacity-50 cursor-not-allowed" 
                    : isSelected
                      ? "bg-[var(--primary-green)]/10 border-[var(--primary-green)] text-[var(--primary-green)] shadow-lg shadow-[var(--primary-green)]/5"
                      : "bg-[var(--bg-darker)] border-[var(--border-green)]/20 text-[var(--text-muted)] hover:border-[var(--primary-green)]/50 hover:text-white"
                  }
                `}
              >
                <div className={`${isSelected ? "scale-110" : ""} transition-transform`}>
                  {platform.icon}
                </div>
                <span className="font-medium text-sm">{platform.name}</span>
                {isExisting && (
                  <span className="text-[10px] uppercase tracking-wider font-bold text-[var(--primary-green)]">Já Vinculado</span>
                )}
              </button>
            );
          })}
        </div>

        {error && (
          <div className="bg-red-400/10 border border-red-400/20 rounded-xl p-4 flex items-center gap-3 text-red-400 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            {error}
          </div>
        )}

        <button
          onClick={handlePublish}
          disabled={selectedPlatforms.length === 0 || loading}
          className="w-full bg-[var(--primary-green)] text-[var(--text-dark)] font-bold py-4 rounded-xl hover:brightness-110 transition-all disabled:opacity-50 disabled:hover:brightness-100 flex items-center justify-center gap-2 shadow-lg shadow-[var(--primary-green)]/10"
        >
          {loading ? (
            <svg className="animate-spin h-5 w-5 text-[var(--text-dark)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
              Publicar nos Canais Selecionados
            </>
          )}
        </button>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--primary-green)]"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Histórico de Destinos
        </h2>

        {destinations.length === 0 ? (
          <div className="bg-[var(--bg-darker)] border border-[var(--border-green)]/10 rounded-2xl p-12 text-center space-y-3">
            <p className="text-[var(--text-muted)]">Nenhum destino configurado para este post.</p>
            <p className="text-sm text-[var(--text-muted)]/60">Selecione as plataformas acima para começar.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-[var(--border-green)]/20 bg-[var(--bg-darker)]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--border-green)]/10 bg-white/5">
                  <th className="p-4 text-xs uppercase tracking-wider font-bold text-[var(--text-muted)]">Plataforma</th>
                  <th className="p-4 text-xs uppercase tracking-wider font-bold text-[var(--text-muted)]">Status</th>
                  <th className="p-4 text-xs uppercase tracking-wider font-bold text-[var(--text-muted)]">Data de Envio</th>
                  <th className="p-4 text-xs uppercase tracking-wider font-bold text-[var(--text-muted)]">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-green)]/5">
                {destinations.map((dest) => (
                  <tr key={dest.id} className="hover:bg-white/5 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-[var(--bg-dark)] border border-[var(--border-green)]/10 text-[var(--primary-green)]">
                          {PLATFORMS.find(p => p.id === dest.platform)?.icon || dest.platform}
                        </div>
                        <span className="font-medium text-white">{PLATFORMS.find(p => p.id === dest.platform)?.name || dest.platform}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${dest.status === 'SUCCESS' ? 'bg-green-400' : dest.status === 'FAILED' ? 'bg-red-400' : 'bg-yellow-400'} animate-pulse`} />
                          <span className={`text-sm font-medium ${getStatusColor(dest.status)}`}>
                            {getStatusLabel(dest.status)}
                          </span>
                        </div>
                        {dest.errorMessage && (
                          <span className="text-xs text-red-400/80 max-w-[200px] truncate" title={dest.errorMessage}>
                            {dest.errorMessage}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-[var(--text-muted)]">
                        {dest.sentAt 
                          ? new Date(dest.sentAt).toLocaleString('pt-BR') 
                          : "Aguardando..."}
                      </span>
                    </td>
                    <td className="p-4">
                      {dest.externalPostId && (
                        <a
                          href={dest.externalPostId}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm text-[var(--primary-green)] hover:underline"
                        >
                          Ver Post
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
