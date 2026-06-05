import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import db from "infra/db";
import { handleFileUpload } from "@/utils/uploadHandler";

/**
 * GET /api/v1/posts
 * Lista todos os posts ordenados por mais recentes primeiro
 * Inclui dados do autor (usuário que criou o post)
 */
export async function GET(request: NextRequest) {
  try {
    const headersList = await headers();
    const userIdFromMiddleware = headersList.get("x-user-id");

    // Validar se há sessão ativa
    if (!userIdFromMiddleware) {
      return NextResponse.json(
        { error: "Usuário não autenticado" },
        { status: 401 },
      );
    }

    // Buscar todos os posts ordenados por data de criação (mais recentes primeiro)
    const posts = await db.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    console.log(
      `[GET /api/v1/posts] ${posts.length} posts recuperados para usuário: ${userIdFromMiddleware}`,
    );

    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error("[GET /api/v1/posts] Erro:", error);
    return NextResponse.json(
      { error: "Erro ao buscar posts" },
      { status: 500 },
    );
  }
}

/**
 * POST /api/v1/posts
 * Cria um novo post associado ao usuário logado
 *
 * Requer:
 * - Headers do middleware (x-user-id)
 * - FormData com "content" (obrigatório) e "file" (opcional)
 * - OU JSON com { content, imageUrl? }
 *
 * Retorna:
 * - Post criado com status 201
 * - Erro se conteúdo inválido ou arquivo inválido (status 400/401)
 */
export async function POST(request: NextRequest) {
  try {
    const headersList = await headers();
    const userIdFromMiddleware = headersList.get("x-user-id");

    // Validar se há sessão ativa
    if (!userIdFromMiddleware) {
      return NextResponse.json(
        { error: "Usuário não autenticado" },
        { status: 401 },
      );
    }

    const contentType = request.headers.get("content-type") || "";
    let content: string | null = null;
    let imageUrl: string | null = null;
    let file: File | null = null;

    // Detectar tipo de conteúdo e fazer parsing apropriado
    if (contentType.includes("multipart/form-data")) {
      // Parse FormData
      const formData = await request.formData();
      content = formData.get("content") as string | null;
      file = formData.get("file") as File | null;
      imageUrl = formData.get("imageUrl") as string | null;
    } else if (contentType.includes("application/json")) {
      // Parse JSON
      const body = await request.json();
      content = body.content as string | null;
      imageUrl = body.imageUrl as string | null;
    } else {
      return NextResponse.json(
        { error: "Content-Type deve ser multipart/form-data ou application/json" },
        { status: 400 },
      );
    }

    // Validação do conteúdo
    if (!content || typeof content !== "string") {
      return NextResponse.json(
        { error: "Conteúdo do post é obrigatório" },
        { status: 400 },
      );
    }

    if (content.trim().length === 0) {
      return NextResponse.json(
        { error: "Conteúdo do post não pode estar vazio" },
        { status: 400 },
      );
    }

    // Processar upload de imagem se fornecido (apenas FormData)
    if (file) {
      console.log(
        `[POST /api/v1/posts] Processando upload de imagem: ${file.name}`,
      );
      const buffer = await file.arrayBuffer();
      const fileBuffer = Buffer.from(buffer);

      const uploadResult = await handleFileUpload(file.name, fileBuffer);
      if (!uploadResult.success) {
        console.warn(
          `[POST /api/v1/posts] Upload falhou: ${uploadResult.error}`,
        );
        return NextResponse.json(
          { error: uploadResult.error || "Erro ao processar a imagem" },
          { status: 400 },
        );
      }
      imageUrl = uploadResult.filePath || null;
    }

    // Criar o post associando ao usuário logado
    const newPost = await db.post.create({
      data: {
        content: content.trim(),
        imageUrl,
        userId: userIdFromMiddleware,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    console.log(
      `[POST /api/v1/posts] Novo post criado com ID: ${newPost.id} por usuário: ${userIdFromMiddleware}`,
    );

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error("[POST /api/v1/posts] Erro:", error);
    return NextResponse.json(
      { error: "Erro ao criar post" },
      { status: 500 },
    );
  }
}
