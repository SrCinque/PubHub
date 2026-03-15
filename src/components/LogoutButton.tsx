"use client";

import { handlerLogout } from "@/app/actions/handlerLogout";
import { CSSProperties } from "react";

/**
 * Componente reutilizável LogoutButton
 * Pode ser importado por qualquer componente (Header, Perfil, Sidebar, etc)
 *
 * Props:
 * - className?: string - Classes CSS customizadas (opcional)
 * - style?: CSSProperties - Estilos inline customizados (opcional)
 * - children?: React.ReactNode - Texto do botão (padrão: "Sair")
 *
 * Exemplo de uso:
 * import { LogoutButton } from "@/components/LogoutButton";
 *
 * // Uso simples (Header)
 * <LogoutButton />
 *
 * // Uso customizado (Perfil)
 * <LogoutButton
 *   className="btn btn-primary w-full justify-center py-4 text-lg font-semibold"
 *   style={{ background: "#ef4444" }}
 * >
 *   Sair da Conta
 * </LogoutButton>
 */
interface LogoutButtonProps {
  className?: string;
  style?: CSSProperties;
  children?: React.ReactNode;
}

export function LogoutButton({
  className = "px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors",
  style,
  children = "Sair",
}: LogoutButtonProps = {}) {
  return (
    <button onClick={handlerLogout} className={className} style={style}>
      {children}
    </button>
  );
}
