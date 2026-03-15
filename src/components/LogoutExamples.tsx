"use client";

/**
 * Exemplos adicionales de como usar handlerLogout em diferentes componentes
 *
 * Exemplo 1: Botão simples (como no Header)
 * Exemplo 2: Botão com confirmação
 * Exemplo 3: Link customizado
 * Exemplo 4: Modal de logout
 */

import { handlerLogout } from "@/app/actions/handlerLogout";
import { useState } from "react";

/**
 * Exemplo 1: LogoutButton simples
 * Reutilível em Header, Sidebar, etc
 */
export function LogoutButtonSimple() {
  return (
    <button
      onClick={handlerLogout}
      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
    >
      Sair
    </button>
  );
}

/**
 * Exemplo 2: LogoutButton com confirmação
 */
export function LogoutButtonWithConfirmation() {
  const handleClick = async () => {
    const confirmed = confirm("Tem certeza que deseja sair?");
    if (confirmed) {
      await handlerLogout();
    }
  };

  return (
    <button
      onClick={handleClick}
      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
    >
      Sair
    </button>
  );
}

/**
 * Exemplo 3: Link customizado que chama logout
 */
export function LogoutLink() {
  return (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        handlerLogout();
      }}
      className="text-red-600 hover:text-red-700 underline"
    >
      Fazer logout
    </a>
  );
}

/**
 * Exemplo 4: Modal de logout com confirmação visual
 */
export function LogoutModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await handlerLogout();
      // Nota: handlerLogout redireciona via window.location.href, logo não chegará aqui
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
      >
        Sair
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm">
        <h2 className="text-xl font-bold mb-4">Confirmar Logout</h2>
        <p className="text-gray-600 mb-6">
          Tem certeza que deseja sair da sua conta?
        </p>

        <div className="flex gap-4">
          <button
            onClick={() => setIsOpen(false)}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? "Saindo..." : "Sair"}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Exemplo 5: Menu dropdown com logout
 */
export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
      >
        Minha Conta
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10">
          <a href="/perfil" className="block px-4 py-2 hover:bg-gray-100">
            Perfil
          </a>
          <a
            href="/configuracoes"
            className="block px-4 py-2 hover:bg-gray-100"
          >
            Configurações
          </a>
          <hr />
          <button
            onClick={handlerLogout}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
          >
            Sair
          </button>
        </div>
      )}
    </div>
  );
}
