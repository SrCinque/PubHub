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
    password: "",
    confirmPassword: "",
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
      if (!formData.password.trim()) {
        throw new Error("Senha é obrigatória");
      }
      if (formData.password.length < 6) {
        throw new Error("Senha deve ter no mínimo 6 caracteres");
      }
      if (formData.password !== formData.confirmPassword) {
        throw new Error("As senhas não correspondem");
      }

      const response = await fetch("/api/v1/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao criar usuário");
      }

      // Dados do usuário criado
      await response.json();
      setSuccess(true);
      setFormData({
        name: "",
        email: "",
        image: "",
        password: "",
        confirmPassword: "",
      });

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
      <section className="section py-24 flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="signup-form-container">
          {/* Form Container */}
          <div className="signup-form-wrapper">
            {/* Header */}
            <div className="signup-form-header">
              <h1 className="signup-form-title">
                Bem-vindo ao{" "}
                <span className="text-[var(--primary-green-light)]">
                  PubHub
                </span>
              </h1>
              <p className="signup-form-subtitle">
                Crie sua conta e comece a publicar em massa
              </p>
            </div>

            {success ? (
              <div className="signup-success-message">
                <div>
                  <svg
                    className="signup-success-icon"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="signup-success-title">
                    Conta criada com sucesso!
                  </h2>
                  <p className="signup-success-subtitle">
                    Redirecionando para sua conta...
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="signup-form">
                {/* Name Input */}
                <div className="signup-form-group">
                  <label htmlFor="name" className="signup-form-label">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="João Silva"
                    className="signup-form-input"
                    disabled={loading}
                  />
                </div>

                {/* Email Input */}
                <div className="signup-form-group">
                  <label htmlFor="email" className="signup-form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="joao@example.com"
                    className="signup-form-input"
                    disabled={loading}
                  />
                </div>

                {/* Password Input */}
                <div className="signup-form-group">
                  <label htmlFor="password" className="signup-form-label">
                    Senha
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Mínimo 6 caracteres"
                    className="signup-form-input"
                    disabled={loading}
                  />
                </div>

                {/* Confirm Password Input */}
                <div className="signup-form-group">
                  <label
                    htmlFor="confirmPassword"
                    className="signup-form-label"
                  >
                    Confirmar Senha
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirme sua senha"
                    className="signup-form-input"
                    disabled={loading}
                  />
                </div>

                {/* Image URL Input */}
                <div className="signup-form-group">
                  <label htmlFor="image" className="signup-form-label">
                    URL da Foto de Perfil{" "}
                    <span className="text-[var(--text-muted)] font-normal">
                      (Opcional)
                    </span>
                  </label>
                  <input
                    type="url"
                    id="image"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="https://example.com/avatar.jpg"
                    className="signup-form-input"
                    disabled={loading}
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <div className="signup-error-message">
                    <svg
                      className="signup-error-icon"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{error}</span>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary w-full justify-center py-4 text-lg font-semibold signup-submit-btn transition-all duration-200 hover:shadow-lg hover:shadow-[var(--primary-green)]/25"
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
                <p className="signup-terms-text">
                  Ao criar uma conta, você concorda com nossos{" "}
                  <Link href="#" className="signup-terms-link">
                    Termos de Serviço
                  </Link>
                </p>
              </form>
            )}

            {/* Login Link */}
            <div className="signup-login-section">
              Já tem uma conta?{" "}
              <Link href="/login" className="signup-login-link">
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
