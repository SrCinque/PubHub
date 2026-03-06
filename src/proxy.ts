import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Proxy para proteger rotas privadas do Next.js
 * Redireciona usuários não autenticados para a página de login
 */
// @ts-ignore - type is inferred from auth wrapper
export default auth((req: NextRequest) => {
  // Se o usuário não está autenticado e tenta acessar uma rota protegida
  const isAuthPage =
    req.nextUrl.pathname.startsWith("/login") ||
    req.nextUrl.pathname.startsWith("/signup");

  const isProtectedRoute =
    req.nextUrl.pathname.startsWith("/dashboard") ||
    req.nextUrl.pathname.startsWith("/posts") ||
    req.nextUrl.pathname.startsWith("/profile") ||
    req.nextUrl.pathname.startsWith("/api/v1");

  // Se não está autenticado e tenta acessar rota protegida
  if (!req.auth && isProtectedRoute) {
    const url = new URL("/login", req.nextUrl.origin);
    return NextResponse.redirect(url);
  }

  // Se está autenticado e tenta acessar página de login/signup
  if (req.auth && isAuthPage) {
    const url = new URL("/dashboard", req.nextUrl.origin);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
});

/**
 * Configurar em quais rotas o middleware deve ser executado
 */
export const config = {
  matcher: [
    // Aplicar ao /api
    "/api/:path*",
    // Aplicar a rotas protegidas
    "/dashboard/:path*",
    "/posts/:path*",
    "/profile/:path*",
    // Aplicar a páginas de autenticação
  ],
};
