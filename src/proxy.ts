import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

interface JWTPayload {
  userId: string;
  userEmail: string;
}

/**
 * Middleware que atua como Auth Guard
 *
 * Fluxo:
 * 1. Intercepta requisições nas rotas protegidas
 * 2. Valida o JWT do cookie session_token
 * 3. Injeta os dados do usuário (userId, userEmail) nos headers personalizados
 * 4. Passa a requisição para a rota com os headers injetados
 *
 * Headers injetados:
 * - x-user-id: string (ID do usuário decodificado do JWT)
 * - x-user-email: string (Email do usuário decodificado do JWT)
 */
export async function proxy(request: NextRequest) {
  // 1. Definir rotas que requerem autenticação e seus métodos
  const pathname = request.nextUrl.pathname;
  const method = request.method;

  // POST em /api/v1/user é pública (criar nova conta)
  // GET, PATCH, DELETE em /api/v1/user exigem autenticação
  const isUserCreateRoute = pathname === "/api/v1/user" && method === "POST";

  // Todas as rotas /api/v1/user/upload exigem autenticação
  const isUserUploadRoute = pathname.startsWith("/api/v1/user/upload");

  // Todas as rotas /api/v1/logout exigem autenticação
  const isLogoutRoute = pathname.startsWith("/api/v1/logout");

  // Outras operações em /api/v1/user (GET, PATCH, DELETE) exigem autenticação
  const isUserAuthRoute =
    pathname === "/api/v1/user" &&
    (method === "GET" || method === "PATCH" || method === "DELETE");

  // Se é POST para criar conta, permitir sem autenticação
  if (isUserCreateRoute) {
    console.log(`[Middleware] Rota pública: ${pathname} ${method}`);
    return NextResponse.next();
  }

  // Verificar se é uma rota que requer autenticação
  const isProtectedRoute =
    isUserAuthRoute || isUserUploadRoute || isLogoutRoute;

  // Se não for rota protegida, continuar normalmente
  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // 2. Recuperar o session_token do cookie HTTP Only
  const sessionToken = request.cookies.get("session_token")?.value;

  console.log(`[Middleware] Rota protegida: ${pathname} ${method}`);
  console.log(`[Middleware] Session token presente: ${!!sessionToken}`);

  // Se não houver token, retornar 401 antes de chegar à rota
  if (!sessionToken) {
    console.error("[Middleware] Erro: session_token não encontrado no cookie");
    return NextResponse.json(
      { error: "Sessão inválida ou expirada. Faça login novamente." },
      { status: 401 },
    );
  }

  // 3. Validar o JWT e extrair os dados do usuário
  let decodedToken: JWTPayload | null = null;
  try {
    const secretKey =
      process.env.JWT_SECRET || "your-secret-key-change-in-production";
    decodedToken = jwt.verify(sessionToken, secretKey) as JWTPayload;
    console.log(
      `[Middleware] JWT validado com sucesso para usuário: ${decodedToken.userEmail}`,
    );
  } catch (error) {
    console.error("[Middleware] Erro ao validar JWT:", error);
    return NextResponse.json(
      { error: "Sessão inválida ou expirada. Faça login novamente." },
      { status: 401 },
    );
  }

  // 4. Injetar os dados do usuário nos headers personalizados
  // Convenção: usar lowercase com hífen (x-user-id, x-user-email)
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-user-id", decodedToken.userId);
  requestHeaders.set("x-user-email", decodedToken.userEmail);

  console.log(`[Middleware] Headers injetados:`, {
    "x-user-id": decodedToken.userId,
    "x-user-email": decodedToken.userEmail,
  });

  // 5. Retornar a requisição com os novos headers
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

// Configurar as rotas onde o middleware deve rodar
export const config = {
  matcher: ["/api/v1/user/:path*", "/api/v1/logout/:path*", "/api/v1/user"],
};
