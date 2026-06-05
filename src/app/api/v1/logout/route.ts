import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import db from "infra/db";

/**
 * DELETE /api/v1/logout
 * Endpoint centralizado para fazer logout
 *
 * Responsabilidades:
 * 1. Recuperar session_token dos cookies
 * 2. Deletar a sessão do banco de dados
 * 3. Expirar o cookie de sessão via Set-Cookie header
 * 4. Revalidar cache
 * 5. Retornar resposta de sucesso
 */
export async function DELETE(request: NextRequest) {
  try {
    // 1. Recuperar o session_token dos cookies
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session_token")?.value;

    // Se não houver sessão ativa, retornar erro 401
    if (!sessionToken) {
      return NextResponse.json(
        { error: "Nenhuma sessão ativa encontrada" },
        { status: 401 },
      );
    }

    // 2. Deletar a sessão do banco de dados
    try {
      await db.session.delete({
        where: { sessionToken },
      });
      console.log("Sessão deletada do banco de dados com sucesso");
    } catch (dbError) {
      console.error("Erro ao deletar sessão do banco:", dbError);
      // Continua mesmo se o DB falhar - o cookie será expirado
    }

    // 3. Criar resposta com header Set-Cookie para expirar o cookie
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

    console.error("Erro no DELETE /api/v1/logout:", message);

    return NextResponse.json(
      { error: message || "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
