"use client";

import { useState } from "react";
import Link from "next/link";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-grid">
      {/* Navigation */}
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-logo">
            <div className="navbar-logo-icon">P</div>
            <span className="navbar-logo-text">PubHub</span>
          </div>

          <div className="navbar-menu">
            <Link href="#" className="navbar-link">
              Início
            </Link>
            <Link href="#" className="navbar-link">
              Preços
            </Link>
            <Link href="#" className="navbar-link">
              FAQ
            </Link>
          </div>

          <div className="navbar-actions">
            <button className="navbar-action-btn">Entrar</button>
            <Link href="/signup" className="navbar-cta-btn">
              Comece agora
            </Link>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {isMenuOpen && (
          <div className="hidden md:block px-4 pb-4 space-y-3">
            <Link href="#" className="block navbar-link">
              Início
            </Link>
            <Link href="#" className="block navbar-link">
              Preços
            </Link>
            <Link href="#" className="block navbar-link">
              FAQ
            </Link>
            <Link
              href="/signup"
              className="w-full block px-4 py-2 btn btn-primary text-center"
            >
              Comece agora
            </Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-grid">
          <div className="hero-content">
            <div>
              <h1 className="hero-title">
                <span className="hero-title-accent">Solução Oficial</span>
                <br />
                para Publicar
                <br />
                Conteúdo em Massa
              </h1>
              <p className="hero-description">
                Publique, distribua e automatize seus conteúdos em múltiplas
                plataformas com integração rápida e suporte completo.
              </p>
            </div>

            <div className="hero-benefits">
              <div className="benefit-item">
                <svg
                  className="benefit-icon"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="benefit-text">
                  Comece agora - Teste grátis por 7 dias
                </span>
              </div>
              <div className="benefit-item">
                <svg
                  className="benefit-icon"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="benefit-text">A maior entrega do mercado</span>
              </div>
              <div className="benefit-item">
                <svg
                  className="benefit-icon"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="benefit-text">Suporte especializado 24/7</span>
              </div>
            </div>

            <Link
              href="/signup"
              className="btn btn-primary"
              style={{ width: "fit-content" }}
            >
              Comece agora
            </Link>
          </div>

          <div className="hero-video">
            <div className="hero-video-container">
              <div className="hero-video-inner">
                <button className="play-button">
                  <svg
                    className="play-icon"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                </button>
                <span className="demo-text">Veja a demonstração</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="features-container">
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-value">Setup</div>
              <p className="feature-label">Instantâneo</p>
            </div>
            <div className="feature-item">
              <div className="feature-value">4000+</div>
              <p className="feature-label">Clientes Ativos</p>
            </div>
            <div className="feature-item">
              <div className="feature-value">🎉</div>
              <p className="feature-label">Suporte Especializado</p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Section */}
      <section className="social-section">
        <div className="social-container">
          <h2 className="social-title">Faça parte do nosso grupo exclusivo</h2>
          <p className="social-description">
            Conecte-se com milhares de criadores e empresas
          </p>

          <div className="social-buttons">
            <button className="btn btn-primary">
              <svg className="btn-icon" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
              <span>YouTube</span>
            </button>
            <button className="btn btn-secondary">Suporte</button>
            <button className="btn btn-accent">
              <svg className="btn-icon" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.057-1.645.069-4.849.069-3.203 0-3.584-.012-4.849-.069-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.265-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z" />
              </svg>
              <span>Instagram</span>
            </button>
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
            <Link href="#" className="footer-link">
              Contato
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
