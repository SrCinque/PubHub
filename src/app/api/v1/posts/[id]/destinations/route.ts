import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import db from "infra/db";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/v1/posts/[id]/destinations
 * Lista todos os destinos de publicação de um post
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id: postId } = await params;

  try {
    const headersList = await headers();
    const userIdFromMiddleware = headersList.get("x-user-id");

    // Validar autenticação
    if (!userIdFromMiddleware) {
      return NextResponse.json(
        { error: "Usuário não autenticado" },
        { status: 401 },
      );
    }

    // Validar se o post existe
    const post = await db.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json(
        { error: "Post não encontrado" },
        { status: 404 },
      );
    }

    // Validar se o usuário é dono do post
    if (post.userId !== userIdFromMiddleware) {
      return NextResponse.json(
        { error: "Você não tem permissão para acessar os destinos deste post" },
        { status: 403 },
      );
    }

    // Buscar destinos do post
    const destinations = await db.postDestination.findMany({
      where: { postId },
      orderBy: { createdAt: "desc" },
    });

    console.log(
      `[GET /api/v1/posts/${postId}/destinations] ${destinations.length} destinos encontrados`,
    );

    return NextResponse.json(destinations, { status: 200 });
  } catch (error) {
    console.error(`[GET /api/v1/posts/[id]/destinations] Erro:`, error);
    return NextResponse.json(
      { error: "Erro ao buscar destinos" },
      { status: 500 },
    );
  }
}

/**
 * POST /api/v1/posts/[id]/destinations
 * Cria novos destinos de publicação para um post
 *
 * Requer:
 * - Headers do middleware (x-user-id)
 * - Body JSON com:
 *   {
 *     "platforms": ["LINKEDIN", "REDDIT"]  // array de plataformas
 *   }
 *
 * Retorna:
 * - Array de PostDestination criados (status 201)
 * - Erro se post não encontrado, não autorizado, ou plataformas inválidas (status 400/403/404)
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  const { id: postId } = await params;

  try {
    const headersList = await headers();
    const userIdFromMiddleware = headersList.get("x-user-id");

    // Validar autenticação
    if (!userIdFromMiddleware) {
      return NextResponse.json(
        { error: "Usuário não autenticado" },
        { status: 401 },
      );
    }

    // Validar se o post existe
    const post = await db.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json(
        { error: "Post não encontrado" },
        { status: 404 },
      );
    }

    // Validar se o usuário é dono do post
    if (post.userId !== userIdFromMiddleware) {
      console.warn(
        `[POST /api/v1/posts/${postId}/destinations] Tentativa não autorizada. Usuário: ${userIdFromMiddleware}, Dono: ${post.userId}`,
      );
      return NextResponse.json(
        { error: "Você não tem permissão para criar destinos para este post" },
        { status: 403 },
      );
    }

    // Validar Content-Type
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return NextResponse.json(
        { error: "Content-Type deve ser application/json" },
        { status: 400 },
      );
    }

    // Parsear body
    const body = await request.json();
    const { platforms } = body;

    // Validações
    if (!platforms) {
      return NextResponse.json(
        { error: "Campo 'platforms' é obrigatório" },
        { status: 400 },
      );
    }

    if (!Array.isArray(platforms)) {
      return NextResponse.json(
        { error: "Campo 'platforms' deve ser um array" },
        { status: 400 },
      );
    }

    if (platforms.length === 0) {
      return NextResponse.json(
        { error: "Pelo menos uma plataforma deve ser fornecida" },
        { status: 400 },
      );
    }

    // Validar plataformas permitidas
    const allowedPlatforms = ["LINKEDIN", "REDDIT", "TWITTER", "FACEBOOK"];
    const invalidPlatforms = platforms.filter(
      (p: string) => !allowedPlatforms.includes(p.toUpperCase()),
    );

    if (invalidPlatforms.length > 0) {
      return NextResponse.json(
        {
          error: `Plataformas inválidas: ${invalidPlatforms.join(", ")}. Permitidas: ${allowedPlatforms.join(", ")}`,
        },
        { status: 400 },
      );
    }

    // Verificar se já existem destinos para essas plataformas
    const existingDestinations = await db.postDestination.findMany({
      where: {
        postId,
        platform: {
          in: platforms.map((p: string) => p.toUpperCase()),
        },
      },
    });

    if (existingDestinations.length > 0) {
      const existingPlatforms = existingDestinations
        .map((d) => d.platform)
        .join(", ");
      return NextResponse.json(
        {
          error: `Destinos já existem para as plataformas: ${existingPlatforms}`,
        },
        { status: 400 },
      );
    }

    // Criar destinos
    const createdDestinations = await Promise.all(
      platforms.map((platform: string) =>
        db.postDestination.create({
          data: {
            postId,
            platform: platform.toUpperCase(),
            status: "PENDING",
          },
        }),
      ),
    );

    console.log(
      `[POST /api/v1/posts/${postId}/destinations] ${createdDestinations.length} destinos criados por usuário: ${userIdFromMiddleware}`,
    );

    return NextResponse.json(createdDestinations, { status: 201 });
  } catch (error) {
    console.error(`[POST /api/v1/posts/[id]/destinations] Erro:`, error);
    return NextResponse.json(
      { error: "Erro ao criar destinos" },
      { status: 500 },
    );
  }
}
