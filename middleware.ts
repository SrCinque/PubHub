import { proxy } from "@/proxy";
import type { NextRequest } from "next/server";

/**
 * Configurar para usar Node.js runtime (não edge)
 * Necessário para usar jsonwebtoken que requer crypto nativo
 */
export const runtime = "nodejs";

/**
 * Next.js Middleware
 * Valida autenticação via JWT e injeta dados do usuário nos headers
 */
export function middleware(request: NextRequest) {
  return proxy(request);
}

/**
 * Configurar as rotas onde o middleware deve rodar
 */
export const config = {
  matcher: [
    "/api/v1/user/:path*",
    "/api/v1/logout/:path*",
    "/api/v1/user",
    "/api/v1/posts/:path*",
    "/api/v1/posts",
  ],
};
