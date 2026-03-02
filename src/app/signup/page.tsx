"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    image: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validações básicas
      if (!formData.name.trim()) {
        throw new Error("Nome é obrigatório");
      }
      if (!formData.email.trim()) {
        throw new Error("Email é obrigatório");
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        throw new Error("Email inválido");
      }

      const response = await fetch("/api/v1/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          image: formData.image.trim() || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao criar usuário");
      }

      const userData = await response.json();
      setSuccess(true);
      setFormData({ name: "", email: "", image: "" });

      // Redireciona após 2 segundos
      setTimeout(() => {
        router.push(`/`);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-grid">
      {/* Navigation */}
      <nav className="navbar">
        <div className="navbar-container">
          <Link href="/" className="flex items-center gap-2 cursor-pointer">
            <div className="navbar-logo-icon">P</div>
            <span className="navbar-logo-text">PubHub</span>
          </Link>

          <div className="navbar-actions">
            <Link href="/" className="navbar-action-btn">
              Voltar
            </Link>
          </div>
        </div>
      </nav>

      {/* Signup Form Section */}
      <section className="section py-16">
        <div className="container max-w-md">
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-bold">
                Bem-vindo ao{" "}
                <span className="text-[var(--primary-green-light)]">
                  PubHub
                </span>
              </h1>
              <p className="text-[var(--text-muted)]">
                Crie sua conta e comece a publicar em massa
              </p>
            </div>

            {success ? (
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6 text-center space-y-2">
                <svg
                  className="w-12 h-12 text-green-400 mx-auto"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <h2 className="text-xl font-bold">Conta criada com sucesso!</h2>
                <p className="text-[var(--text-muted)] text-sm">
                  Redirecionando para seu perfil...
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Input */}
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="João Silva"
                    className="w-full px-4 py-3 bg-white/5 border border-[var(--border-green)] rounded-lg focus:outline-none focus:border-[var(--primary-green-light)] focus:bg-white/10 transition text-white placeholder-gray-500"
                    disabled={loading}
                  />
                </div>

                {/* Email Input */}
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="joao@example.com"
                    className="w-full px-4 py-3 bg-white/5 border border-[var(--border-green)] rounded-lg focus:outline-none focus:border-[var(--primary-green-light)] focus:bg-white/10 transition text-white placeholder-gray-500"
                    disabled={loading}
                  />
                </div>

                {/* Image URL Input */}
                <div className="space-y-2">
                  <label htmlFor="image" className="block text-sm font-medium">
                    URL da Foto de Perfil (Opcional)
                  </label>
                  <input
                    type="url"
                    id="image"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="https://example.com/avatar.jpg"
                    className="w-full px-4 py-3 bg-white/5 border border-[var(--border-green)] rounded-lg focus:outline-none focus:border-[var(--primary-green-light)] focus:bg-white/10 transition text-white placeholder-gray-500"
                    disabled={loading}
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400 text-sm">
                    {error}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary w-full justify-center"
                >
                  {loading ? (
                    <>
                      <span className="inline-block animate-spin mr-2">⏳</span>
                      Criando conta...
                    </>
                  ) : (
                    "Criar Conta"
                  )}
                </button>

                {/* Terms Text */}
                <p className="text-center text-xs text-[var(--text-muted)]">
                  Ao criar uma conta, você concorda com nossos{" "}
                  <Link
                    href="#"
                    className="text-[var(--primary-green-light)] hover:underline"
                  >
                    Termos de Serviço
                  </Link>
                </p>
              </form>
            )}

            {/* Login Link */}
            <div className="text-center text-sm text-[var(--text-muted)]">
              Já tem uma conta?{" "}
              <Link
                href="/login"
                className="text-[var(--primary-green-light)] hover:underline font-medium"
              >
                Faça login
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <p className="footer-content">
            Desenvolvido com ❤️ por Filipe Cinque
          </p>
          <div className="footer-links">
            <Link href="#" className="footer-link">
              Política de Privacidade
            </Link>
            <Link href="#" className="footer-link">
              Termos de Serviço
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
