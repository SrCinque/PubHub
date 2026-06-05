import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import authService from "@/services/authService";
import db from "infra/db";

/**
 * POST /api/v1/auth
 * Autentica um usuário com email e senha
 * Returns: Dados do usuário, ou erro 401
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

    // 3. Criar uma nova sessão para o usuário (passando userId e userEmail)
    const session = await authService.createSession(
      authenticatedUser.id,
      authenticatedUser.email,
    );

    // 4. Setar o cookie de sessão com configurações de segurança
    const cookieStore = await cookies();
    cookieStore.set("session_token", session.sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 dias em segundos
    });

    // 5. Revalidar o cache para atualizar componentes como Header
    revalidatePath("/", "layout");

    // 6. Retornar apenas os dados básicos do usuário (sem o token no JSON)
    return NextResponse.json(
      {
        user: authenticatedUser,
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

/**
 * DELETE /api/v1/auth
 * Faz logout do usuário
 * - Remove a sessão do banco de dados
 * - Expira o cookie de sessão
 * Returns: Status 200 em caso de sucesso, 401 se não autenticado
 */
export async function DELETE(request: NextRequest) {
  try {
    // 1. Recuperar o session_token dos cookies
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session_token")?.value;

    // Se não houver sessão ativa, retornar erro
    if (!sessionToken) {
      return NextResponse.json(
        { error: "Nenhuma sessão ativa encontrada" },
        { status: 401 },
      );
    }

    // 2. Executar a lógica de exclusão da sessão no banco de dados
    try {
      await db.session.delete({
        where: { sessionToken },
      });
      console.log("Sessão deletada do banco de dados com sucesso");
    } catch (dbError) {
      console.error("Erro ao deletar sessão do banco:", dbError);
      // Continua mesmo se o DB falhar - o cookie será expirado
    }

    // 3. Criar uma resposta com header Set-Cookie para expirar o cookie
    const response = NextResponse.json(
      { message: "Logout realizado com sucesso" },
      { status: 200 },
    );

    // Expirar o cookie definindo maxAge = 0
    response.cookies.set("session_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
      maxAge: 0, // Expira o cookie imediatamente
    });

    // 4. Revalidar o cache para atualizar componentes como Header
    revalidatePath("/", "layout");

    return response;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro ao processar logout";

    console.error("Erro no DELETE /api/v1/auth:", message);

    return NextResponse.json(
      { error: message || "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
