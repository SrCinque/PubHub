"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { handlerUpdateUser } from "@/app/actions/handlerUpdateUser";

interface ClientProfileFormProps {
  userData: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    createdAt: string;
    emailVerified: boolean | null;
  };
}

export function ClientProfileForm({ userData }: ClientProfileFormProps) {
  const router = useRouter();
  const [name, setName] = useState(userData.name || "");
  const [avatar, setAvatar] = useState(userData.image || "");
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const getInitials = (name: string | null, email: string) => {
    if (name && name.trim().length > 0) return name.trim().charAt(0).toUpperCase();
    return email.charAt(0).toUpperCase();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tamanho (2MB)
    if (file.size > 2 * 1024 * 1024) {
      setMessage({ type: "error", text: "Arquivo muito grande (máx 2MB)" });
      return;
    }

    setIsUploading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/v1/user/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setAvatar(data.imageUrl);
        setMessage({ type: "success", text: "Foto de perfil atualizada!" });
        router.refresh();
      } else {
        setMessage({ type: "error", text: data.error || "Erro no upload" });
      }
    } catch (error) {
      console.error("Erro no upload:", error);
      setMessage({ type: "error", text: "Erro ao enviar imagem" });
    } finally {
      setIsUploading(false);
    }
  };

  const dataCriacao = userData?.createdAt
    ? new Date(userData.createdAt).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "N/A";

  const handleSave = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const result = await handlerUpdateUser(userData.id, { name });

      if (result.success) {
        setMessage({
          type: "success",
          text: result.message,
        });
        setIsEditing(false);
        setTimeout(() => {
          router.refresh();
        }, 1000);
      } else {
        setMessage({
          type: "error",
          text: result.message,
        });
      }
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      setMessage({
        type: "error",
        text: "Erro ao atualizar perfil. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsEditing(true);
    setMessage(null);
  };

  const handleCancelClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsEditing(false);
    setName(userData.name || "");
    setMessage(null);
  };

  return (
    <div className="space-y-6">
      {message && (
        <div
          className={`p-4 rounded-lg border flex items-center gap-3 animate-in slide-in-from-top duration-300 ${
            message.type === "success"
              ? "bg-green-500/10 border-green-500/50 text-green-400"
              : "bg-red-500/10 border-red-500/50 text-red-400"
          }`}
        >
          {message.type === "success" ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
          )}
          <span className="font-medium">{message.text}</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row items-center gap-8 pb-8 border-b border-white/5">
        <div className="relative group">
          <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-[var(--border-green)] bg-white/5 flex items-center justify-center text-4xl font-bold text-[var(--primary-green)] shadow-2xl">
            {avatar ? (
              <img
                src={avatar}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              getInitials(userData.name, userData.email)
            )}
            
            {isUploading && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[var(--primary-green)] border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
          
          <label className="absolute bottom-0 right-0 p-2 bg-[var(--primary-green)] text-[var(--text-dark)] rounded-full cursor-pointer hover:scale-110 transition-all shadow-lg group-hover:rotate-12">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </label>
        </div>

        <div className="text-center md:text-left space-y-1">
          <h3 className="text-xl font-bold text-white">{userData.name || "Usuário PubHub"}</h3>
          <p className="text-[var(--text-muted)] text-sm">{userData.email}</p>
          <p className="text-xs text-[var(--primary-green)] font-medium pt-2">
            {isUploading ? "Enviando..." : "Clique no ícone para alterar sua foto"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider">
            Nome Completo
          </label>
          {isEditing ? (
            <input
              type="text"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--primary-green)] focus:ring-1 focus:ring-[var(--primary-green)] transition-all"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
              placeholder="Digite seu nome"
            />
          ) : (
            <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white font-medium">
              {name || "Não informado"}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider">
            Endereço de E-mail
          </label>
          <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white/70 flex items-center justify-between">
            <span className="font-medium">{userData.email}</span>
            {userData.emailVerified ? (
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full font-bold uppercase tracking-tighter">Verificado</span>
            ) : (
              <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full font-bold uppercase tracking-tighter">Pendente</span>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider">
            Membro desde
          </label>
          <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white/70 font-medium">
            {dataCriacao}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider">
            ID da Conta
          </label>
          <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white/40 font-mono text-xs overflow-hidden text-ellipsis">
            {userData.id}
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-white/5 flex justify-end gap-4">
        {isEditing ? (
          <>
            <button
              onClick={handleCancelClick}
              disabled={isLoading}
              className="px-6 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-all font-medium border border-white/10"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="px-6 py-2 bg-[var(--primary-green)] hover:bg-[var(--primary-green-light)] text-[var(--text-dark)] rounded-lg transition-all font-bold shadow-lg shadow-[var(--primary-green)]/20 disabled:opacity-50"
            >
              {isLoading ? "Salvando..." : "Salvar Alterações"}
            </button>
          </>
        ) : (
          <button
            onClick={handleEditClick}
            className="px-6 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-all font-medium border border-white/10 flex items-center gap-2 group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-12 transition-transform"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Editar Perfil
          </button>
        )}
      </div>
    </div>
  );
}
