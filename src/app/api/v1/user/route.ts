import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import user from "@services/user";

// Tipo customizado para headers com dados de autenticação
interface AuthHeaders {
  "x-user-id": string | null;
  "x-user-email": string | null;
}

/**
 * GET /api/v1/user
 * Recupera dados do usuário autenticado
 * Dados injetados pelo middleware nos headers customizados
 */
async function GET(request: NextRequest) {
  try {
    // Recuperar headers da requisição
    const headersList = await headers();

    // Extrair dados injetados pelo middleware
    const userIdFromMiddleware = headersList.get("x-user-id");
    const userEmailFromMiddleware = headersList.get("x-user-email");

    // DEBUG: Log para verificar se os headers estão chegando
    console.log("[GET /api/v1/user] Headers recebidos:", {
      "x-user-id": userIdFromMiddleware,
      "x-user-email": userEmailFromMiddleware,
    });

    // Validar se pelo menos o ID está presente
    if (!userIdFromMiddleware) {
      console.error(
        "[GET /api/v1/user] Erro: x-user-id não encontrado nos headers",
      );
      return NextResponse.json(
        {
          error: "Dados do usuário não encontrados",
          debug: "header x-user-id missing",
        },
        { status: 401 },
      );
    }

    // Buscar dados do usuário pelo ID
    const userData = await user.getById(userIdFromMiddleware);

    if (!userData) {
      console.warn(
        `[GET /api/v1/user] Usuário não encontrado para ID: ${userIdFromMiddleware}`,
      );

      // Fallback: tentar buscar por email se o ID falhar
      if (userEmailFromMiddleware) {
        const userByEmail = await user.getByEmail(userEmailFromMiddleware);
        if (userByEmail) {
          console.log(
            `[GET /api/v1/user] Usuário encontrado por email: ${userEmailFromMiddleware}`,
          );
          return NextResponse.json(userByEmail, { status: 200 });
        }
      }

      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 },
      );
    }

    console.log(`[GET /api/v1/user] Usuário recuperado: ${userData.email}`);
    return NextResponse.json(userData, { status: 200 });
  } catch (error) {
    console.error("[GET /api/v1/user] Erro:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

/**
 * POST /api/v1/user
 * Cria um novo usuário (não requer autenticação via middleware)
 * Body: { name, email, image?, password }
 */
async function POST(request: NextRequest) {
  try {
    // Debug: Log do request
    const contentType = request.headers.get("content-type");
    console.log("[POST /api/v1/user] Content-Type recebido:", contentType);

    let body;
    try {
      const rawBody = await request.text();
      console.log("[POST /api/v1/user] Raw body recebido:", rawBody);
      console.log("[POST /api/v1/user] Raw body length:", rawBody.length);

      // Se estiver vazio, retornar erro
      if (!rawBody || rawBody.trim() === "") {
        throw new Error("Corpo da requisição vazio");
      }

      body = JSON.parse(rawBody);
      console.log("[POST /api/v1/user] JSON parseado com sucesso");
    } catch (parseError) {
      console.error(
        "[POST /api/v1/user] Erro ao fazer parse do JSON:",
        parseError,
      );
      return NextResponse.json(
        { error: "JSON inválido no corpo da requisição" },
        { status: 400 },
      );
    }

    const { name, email, image, password } = body;

    console.log(`[POST /api/v1/user] Criando novo usuário: ${email}`);

    if (!name || !email) {
      console.warn("[POST /api/v1/user] Erro: name ou email faltando");
      return NextResponse.json(
        { error: "Nome e e-mail é necessário" },
        { status: 400 },
      );
    }

    const newUser = await user.create({
      name,
      email,
      image,
      password,
    });

    console.log(
      `[POST /api/v1/user] Usuário criado com sucesso: ${newUser.id}`,
    );

    // Revalidar o cache para atualizar o Header
    revalidatePath("/", "layout");

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Erro desconhecido";
    console.error("[POST /api/v1/user] Erro:", errorMessage);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

/**
 * PATCH /api/v1/user
 * Atualiza dados do usuário autenticado
 * Requer headers injetados pelo middleware (x-user-id)
 * Body: { id, name?, image? }
 */
async function PATCH(request: NextRequest) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error(
        "[PATCH /api/v1/user] Erro ao fazer parse do JSON:",
        parseError,
      );
      return NextResponse.json(
        { error: "JSON inválido no corpo da requisição" },
        { status: 400 },
      );
    }

    const { id, name, image } = body;

    console.log(`[PATCH /api/v1/user] Atualizando usuário: ${id}`);

    if (!id) {
      console.warn("[PATCH /api/v1/user] Erro: ID do usuário não fornecido");
      return NextResponse.json(
        { error: "ID do usuário é necessário" },
        { status: 400 },
      );
    }

    if (!name && !image) {
      console.warn("[PATCH /api/v1/user] Erro: nenhum campo para atualizar");
      return NextResponse.json(
        { error: "Forneça pelo menos o 'nome' ou a 'imagem' para atualizar." },
        { status: 400 },
      );
    }

    const updatedUser = await user.update(id, {
      ...(name && { name }),
      ...(image && { image }),
    });

    console.log(`[PATCH /api/v1/user] Usuário atualizado: ${updatedUser.id}`);

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Erro desconhecido";
    console.error("[PATCH /api/v1/user] Erro:", errorMessage);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export { GET, POST, PATCH };
