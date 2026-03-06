"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
      if (!formData.email.trim()) {
        throw new Error("Email é obrigatório");
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        throw new Error("Email inválido");
      }
      if (!formData.password.trim()) {
        throw new Error("Senha é obrigatória");
      }

      // Fazer login usando NextAuth
      const result = await signIn("credentials", {
        email: formData.email.trim(),
        password: formData.password,
        redirect: false,
      });

      if (!result?.ok) {
        throw new Error(result?.error || "Erro ao fazer login");
      }

      setSuccess(true);
      setFormData({
        email: "",
        password: "",
      });

      // Redireciona após 2 segundos
      setTimeout(() => {
        router.push("/");
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

      {/* Login Form Section */}
      <section className="section py-24 flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="login-form-container">
          {/* Form Container */}
          <div className="login-form-wrapper">
            {/* Header */}
            <div className="login-form-header">
              <h1 className="login-form-title">
                Bem-vindo de volta ao{" "}
                <span className="text-[var(--primary-green-light)]">
                  PubHub
                </span>
              </h1>
              <p className="login-form-subtitle">
                Faça login em sua conta para continuar
              </p>
            </div>

            {success ? (
              <div className="login-success-message">
                <div>
                  <svg
                    className="login-success-icon"
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
                  <h2 className="login-success-title">
                    Login realizado com sucesso!
                  </h2>
                  <p className="login-success-subtitle">
                    Redirecionando para sua conta...
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="login-form">
                {/* Email Input */}
                <div className="login-form-group">
                  <label htmlFor="email" className="login-form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="seu@email.com"
                    className="login-form-input"
                    disabled={loading}
                  />
                </div>

                {/* Password Input */}
                <div className="login-form-group">
                  <label htmlFor="password" className="login-form-label">
                    Senha
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Sua senha"
                    className="login-form-input"
                    disabled={loading}
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <div className="login-error-message">
                    <svg
                      className="login-error-icon"
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
                  className="btn btn-primary w-full justify-center py-4 text-lg font-semibold login-submit-btn transition-all duration-200 hover:shadow-lg hover:shadow-[var(--primary-green)]/25"
                >
                  {loading ? (
                    <>
                      <span className="inline-block animate-spin mr-2">⏳</span>
                      Autenticando...
                    </>
                  ) : (
                    "Fazer Login"
                  )}
                </button>

                {/* Forgot Password Link */}
                <p className="login-forgot-password">
                  Esqueceu sua senha?{" "}
                  <Link href="#" className="login-forgot-password-link">
                    Recuperar senha
                  </Link>
                </p>
              </form>
            )}

            {/* Signup Link */}
            <div className="login-signup-section">
              Não tem uma conta?{" "}
              <Link href="/signup" className="login-signup-link">
                Criar conta
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
