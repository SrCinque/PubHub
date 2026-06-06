import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import db from "infra/db";
import { handleFileUpload } from "@/utils/uploadHandler";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/v1/posts/[id]
 * Recupera um post específico
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

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

    const post = await db.post.findUnique({
      where: { id },
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

    if (!post) {
      return NextResponse.json(
        { error: "Post não encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json(post, { status: 200 });
  } catch (error) {
    console.error(`[GET /api/v1/posts/${id}] Erro:`, error);
    return NextResponse.json({ error: "Erro ao buscar post" }, { status: 500 });
  }
}

/**
 * PATCH /api/v1/posts/[id]
 * Edita parcialmente um post (apenas o autor pode editar)
 *
 * Requer:
 * - Headers do middleware (x-user-id)
 * - FormData com "content" (opcional) e "file" (opcional)
 * - OU JSON com { content?, imageUrl? }
 *
 * Retorna:
 * - Post atualizado (status 200)
 * - Erro se não autorizado, post não encontrado, ou dados inválidos
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

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

    // Validar se o ID é válido
    if (!id || id.trim().length === 0) {
      return NextResponse.json(
        { error: "ID do post é obrigatório" },
        { status: 400 },
      );
    }

    // Verificar se o post existe
    const existingPost = await db.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return NextResponse.json(
        { error: "Post não encontrado" },
        { status: 404 },
      );
    }

    // Verificar se o usuário é o autor do post
    if (existingPost.userId !== userIdFromMiddleware) {
      console.warn(
        `[PATCH /api/v1/posts/${id}] Tentativa não autorizada de editar post. Usuário: ${userIdFromMiddleware}, Autor: ${existingPost.userId}`,
      );
      return NextResponse.json(
        { error: "Você não tem permissão para editar este post" },
        { status: 403 },
      );
    }

    const contentType = request.headers.get("content-type") || "";
    let content: string | null = null;
    let file: File | null = null;
    let imageUrl: string | null = null;

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
        {
          error:
            "Content-Type deve ser multipart/form-data ou application/json",
        },
        { status: 400 },
      );
    }

    // Preparar dados para atualização (apenas campos fornecidos)
    const updateData: { content?: string; imageUrl?: string | null } = {};

    // Validar e adicionar conteúdo se fornecido
    if (content !== null && content !== undefined) {
      if (typeof content !== "string") {
        return NextResponse.json(
          { error: "Conteúdo do post deve ser uma string" },
          { status: 400 },
        );
      }

      if (content.trim().length === 0) {
        return NextResponse.json(
          { error: "Conteúdo do post não pode estar vazio" },
          { status: 400 },
        );
      }

      updateData.content = content.trim();
    }

    // Validar e adicionar imageUrl se fornecido
    if (imageUrl !== null && imageUrl !== undefined) {
      updateData.imageUrl =
        imageUrl.trim().length === 0 ? null : imageUrl.trim();
    }

    // Se houver arquivo, fazer upload
    if (file) {
      console.log(
        `[PATCH /api/v1/posts/${id}] Processando novo upload de imagem: ${file.name}`,
      );
      const buffer = await file.arrayBuffer();
      const fileBuffer = Buffer.from(buffer);

      const uploadResult = await handleFileUpload(file.name, fileBuffer);
      if (!uploadResult.success) {
        console.warn(
          `[PATCH /api/v1/posts/${id}] Upload falhou: ${uploadResult.error}`,
        );
        return NextResponse.json(
          { error: uploadResult.error || "Erro ao processar a imagem" },
          { status: 400 },
        );
      }

      updateData.imageUrl = uploadResult.filePath || null;
    }

    // Se nenhum campo foi fornecido, retornar erro
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "Nenhum campo para atualizar foi fornecido" },
        { status: 400 },
      );
    }

    // Atualizar o post
    const updatedPost = await db.post.update({
      where: { id },
      data: updateData,
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
      `[PATCH /api/v1/posts/${id}] Post atualizado por usuário: ${userIdFromMiddleware}`,
    );

    return NextResponse.json(updatedPost, { status: 200 });
  } catch (error) {
    console.error(`[PATCH /api/v1/posts/${id}] Erro:`, error);
    return NextResponse.json(
      { error: "Erro ao atualizar post" },
      { status: 500 },
    );
  }
}

/**
 * PUT /api/v1/posts/[id]
 * Substitui completamente um post (apenas o autor pode editar)
 *
 * Requer:
 * - Headers do middleware (x-user-id)
 * - FormData com "content" (obrigatório) e "file" (opcional)
 * - OU JSON com { content (obrigatório), imageUrl? }
 *
 * Retorna:
 * - Post atualizado (status 200)
 * - Erro se não autorizado, post não encontrado, ou dados inválidos
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

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

    // Validar se o ID é válido
    if (!id || id.trim().length === 0) {
      return NextResponse.json(
        { error: "ID do post é obrigatório" },
        { status: 400 },
      );
    }

    // Verificar se o post existe
    const existingPost = await db.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return NextResponse.json(
        { error: "Post não encontrado" },
        { status: 404 },
      );
    }

    // Verificar se o usuário é o autor do post
    if (existingPost.userId !== userIdFromMiddleware) {
      console.warn(
        `[PUT /api/v1/posts/${id}] Tentativa não autorizada de editar post. Usuário: ${userIdFromMiddleware}, Autor: ${existingPost.userId}`,
      );
      return NextResponse.json(
        { error: "Você não tem permissão para editar este post" },
        { status: 403 },
      );
    }

    const contentType = request.headers.get("content-type") || "";
    let content: string | null = null;
    let file: File | null = null;
    let imageUrl: string | null = existingPost.imageUrl; // Manter imagem atual por padrão

    // Detectar tipo de conteúdo e fazer parsing apropriado
    if (contentType.includes("multipart/form-data")) {
      // Parse FormData
      const formData = await request.formData();
      content = formData.get("content") as string | null;
      file = formData.get("file") as File | null;
      imageUrl = (formData.get("imageUrl") as string | null) || imageUrl;
    } else if (contentType.includes("application/json")) {
      // Parse JSON
      const body = await request.json();
      content = body.content as string | null;
      imageUrl = body.imageUrl as string | null;
    } else {
      return NextResponse.json(
        {
          error:
            "Content-Type deve ser multipart/form-data ou application/json",
        },
        { status: 400 },
      );
    }

    // Validação: content é obrigatório no PUT
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

    // Preparar dados para atualização completa
    const updateData: { content: string; imageUrl: string | null } = {
      content: content.trim(),
      imageUrl: imageUrl,
    };

    // Se houver arquivo, fazer upload
    if (file) {
      console.log(
        `[PUT /api/v1/posts/${id}] Processando novo upload de imagem: ${file.name}`,
      );
      const buffer = await file.arrayBuffer();
      const fileBuffer = Buffer.from(buffer);

      const uploadResult = await handleFileUpload(file.name, fileBuffer);
      if (!uploadResult.success) {
        console.warn(
          `[PUT /api/v1/posts/${id}] Upload falhou: ${uploadResult.error}`,
        );
        return NextResponse.json(
          { error: uploadResult.error || "Erro ao processar a imagem" },
          { status: 400 },
        );
      }

      updateData.imageUrl = uploadResult.filePath || null;
    }

    // Atualizar o post (substituição completa)
    const updatedPost = await db.post.update({
      where: { id },
      data: updateData,
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
      `[PUT /api/v1/posts/${id}] Post atualizado por usuário: ${userIdFromMiddleware}`,
    );

    return NextResponse.json(updatedPost, { status: 200 });
  } catch (error) {
    console.error(`[PUT /api/v1/posts/${id}] Erro:`, error);
    return NextResponse.json(
      { error: "Erro ao atualizar post" },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/v1/posts/[id]
 * Deleta um post (apenas o autor pode deletar)
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

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

    // Validar se o ID é válido
    if (!id || id.trim().length === 0) {
      return NextResponse.json(
        { error: "ID do post é obrigatório" },
        { status: 400 },
      );
    }

    // Verificar se o post existe
    const existingPost = await db.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return NextResponse.json(
        { error: "Post não encontrado" },
        { status: 404 },
      );
    }

    // Verificar se o usuário é o autor do post
    if (existingPost.userId !== userIdFromMiddleware) {
      console.warn(
        `[DELETE /api/v1/posts/${id}] Tentativa não autorizada de deletar post. Usuário: ${userIdFromMiddleware}, Autor: ${existingPost.userId}`,
      );
      return NextResponse.json(
        { error: "Você não tem permissão para deletar este post" },
        { status: 403 },
      );
    }

    // Deletar o post
    await db.post.delete({
      where: { id },
    });

    console.log(
      `[DELETE /api/v1/posts/${id}] Post deletado por usuário: ${userIdFromMiddleware}`,
    );

    return NextResponse.json(
      { message: "Post deletado com sucesso" },
      { status: 200 },
    );
  } catch (error) {
    console.error(`[DELETE /api/v1/posts/${id}] Erro:`, error);
    return NextResponse.json(
      { error: "Erro ao deletar post" },
      { status: 500 },
    );
  }
}
