import { NextRequest, NextResponse } from "next/server";
import authService from "@/services/authService";

/**
 * POST /api/v1/auth
 * Autentica um usuário com email e senha
 * Returns: Dados do usuário e da sessão, ou erro 401
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Extrair email e password do corpo da requisição
    const body = await request.json();
    const { email, password } = body;

    // Validação básica
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email e senha são obrigatórios" },
        { status: 400 },
      );
    }

    // 2. Chamar a função de autenticação da service
    const authenticatedUser = await authService.getAuthenticatedUser(
      email,
      password,
    );

    // 3. Criar uma nova sessão para o usuário
    const session = await authService.createSession(authenticatedUser.id);

    // 4. Retornar o usuário e os dados da sessão
    return NextResponse.json(
      {
        user: authenticatedUser,
        session: {
          id: session.id,
          sessionToken: session.sessionToken,
          expires: session.expires,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    // Tratamento de erro
    const message =
      error instanceof Error ? error.message : "Erro ao processar autenticação";

    // Se for erro de credenciais inválidas, retornar 401
    if (
      message === "Email ou senha incorretos" ||
      message.includes("Email ou senha")
    ) {
      return NextResponse.json(
        { error: "Email ou senha incorretos" },
        { status: 401 },
      );
    }

    // Para outros erros, retornar 500
    return NextResponse.json(
      { error: message || "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
