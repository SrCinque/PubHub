"use client";

import { useState } from "react";
import Link from "next/link";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated Background Grid */}
      <div className="fixed inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(0deg, transparent 24%, #10B981 25%, #10B981 26%, transparent 27%, transparent 74%, #10B981 75%, #10B981 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, #10B981 25%, #10B981 26%, transparent 27%, transparent 74%, #10B981 75%, #10B981 76%, transparent 77%, transparent)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 border-b border-green-500/30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                <span className="text-black font-bold">P</span>
              </div>
              <span className="text-xl font-bold text-green-400">PubHub</span>
            </div>

            {/* Menu */}
            <div className="hidden md:flex space-x-8">
              <Link href="#" className="hover:text-green-400 transition">
                Início
              </Link>
              <Link href="#" className="hover:text-green-400 transition">
                Preços
              </Link>
              <Link href="#" className="hover:text-green-400 transition">
                FAQ
              </Link>
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex space-x-4">
              <button className="px-6 py-2 text-sm font-medium hover:text-green-400 transition">
                Entrar
              </button>
              <button className="px-6 py-2 bg-green-500 text-black rounded-full font-semibold hover:bg-green-400 transition">
                Comece agora
              </button>
            </div>

            {/* Mobile Menu Button */}
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

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden pb-4 space-y-3">
              <Link href="#" className="block hover:text-green-400 transition">
                Início
              </Link>
              <Link href="#" className="block hover:text-green-400 transition">
                Preços
              </Link>
              <Link href="#" className="block hover:text-green-400 transition">
                FAQ
              </Link>
              <button className="w-full px-4 py-2 bg-green-500 text-black rounded-lg font-semibold">
                Comece agora
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
                <span className="text-green-400">Solução Oficial</span>
                <br />
                para Publicar
                <br />
                Conteúdo em Massa
              </h1>
              <p className="text-gray-400 text-lg max-w-md">
                Publique, distribua e automatize seus conteúdos em múltiplas
                plataformas com integração rápida e suporte completo.
              </p>
            </div>

            {/* Benefits */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <svg
                  className="w-6 h-6 text-green-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Comece agora - Teste grátis por 7 dias</span>
              </div>
              <div className="flex items-center space-x-3">
                <svg
                  className="w-6 h-6 text-green-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>A maior entrega do mercado</span>
              </div>
              <div className="flex items-center space-x-3">
                <svg
                  className="w-6 h-6 text-green-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Suporte especializado 24/7</span>
              </div>
            </div>

            {/* CTA Button */}
            <button className="inline-block px-8 py-3 bg-green-500 text-black rounded-full font-bold hover:bg-green-400 transition transform hover:scale-105">
              Comece agora
            </button>
          </div>

          {/* Right Content - Video/Demo */}
          <div className="relative">
            <div className="bg-gradient-to-br from-green-500/20 to-black border border-green-500/30 rounded-lg p-1 aspect-video flex items-center justify-center">
              <div className="w-full h-full bg-black/50 rounded-lg flex items-center justify-center group cursor-pointer">
                <button className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center group-hover:bg-green-400 transition">
                  <svg
                    className="w-8 h-8 text-black ml-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                </button>
                <span className="absolute text-green-400 font-semibold text-lg ml-20">
                  Veja a demonstração
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 border-t border-green-500/30 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-400 mb-2">
                Setup
              </div>
              <p className="text-gray-400">Instantâneo</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-400 mb-2">
                4000+
              </div>
              <p className="text-gray-400">Clientes Ativos</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-400 mb-2">🎉</div>
              <p className="text-gray-400">Suporte Especializado</p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Section */}
      <section className="relative z-10 border-t border-green-500/30 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="text-4xl font-bold">
            Faça parte do nosso grupo exclusivo
          </h2>
          <p className="text-gray-400 text-lg">
            Conecte-se com milhares de criadores e empresas
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-6 py-2 bg-green-500 text-black rounded-full font-semibold hover:bg-green-400 transition flex items-center space-x-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
              <span>YouTube</span>
            </button>
            <button className="px-6 py-2 bg-gray-700 text-white rounded-full font-semibold hover:bg-gray-600 transition">
              Suporte
            </button>
            <button className="px-6 py-2 bg-pink-500 text-white rounded-full font-semibold hover:bg-pink-400 transition flex items-center space-x-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.057-1.645.069-4.849.069-3.203 0-3.584-.012-4.849-.069-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.265-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z" />
              </svg>
              <span>Instagram</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-green-500/30 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-400">
            <p className="mb-4">Desenvolvido com ❤️ por Filipe Cinque</p>
            <div className="flex justify-center space-x-6">
              <Link href="#" className="hover:text-green-400 transition">
                Política de Privacidade
              </Link>
              <Link href="#" className="hover:text-green-400 transition">
                Termos de Serviço
              </Link>
              <Link href="#" className="hover:text-green-400 transition">
                Contato
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
