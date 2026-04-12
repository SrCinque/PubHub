import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { handleFileUpload } from "@/utils/uploadHandler";
import user from "@/services/user";

/**
 * POST /api/v1/user/upload
 * Processa o upload de foto de perfil do usuário
 *
 * Requer:
 * - Headers do middleware (x-user-id)
 * - FormData com arquivo na chave "file"
 *
 * Retorna:
 * - Usuário atualizado com URL da imagem (status 200)
 * - Erro se arquivo inválido ou usuário não encontrado (status 400/404/401)
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Validar autenticação via headers do middleware
    const headersList = await headers();
    const userIdFromMiddleware = headersList.get("x-user-id");

    if (!userIdFromMiddleware) {
      console.error("[POST /api/v1/user/upload] Erro: Usuário não autenticado");
      return NextResponse.json(
        { error: "Usuário não autenticado" },
        { status: 401 },
      );
    }

    // 2. Parsear FormData
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      console.warn("[POST /api/v1/user/upload] Erro: Arquivo não fornecido");
      return NextResponse.json(
        { error: "Arquivo não fornecido" },
        { status: 400 },
      );
    }

    // 3. Converter File para Buffer
    const buffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(buffer);

    console.log(
      `[POST /api/v1/user/upload] Processando upload para usuário: ${userIdFromMiddleware}`,
    );
    console.log(`[POST /api/v1/user/upload] Nome do arquivo: ${file.name}`);
    console.log(`[POST /api/v1/user/upload] Tamanho: ${file.size} bytes`);

    // 4. Processar upload
    const uploadResult = await handleFileUpload(file.name, fileBuffer);

    if (!uploadResult.success) {
      console.warn(
        `[POST /api/v1/user/upload] Upload falhou: ${uploadResult.error}`,
      );
      return NextResponse.json(
        { error: uploadResult.error || "Erro ao processar o arquivo" },
        { status: 400 },
      );
    }

    // 5. Atualizar usuário no banco com nova imagem
    let updatedUser;
    try {
      updatedUser = await user.update(userIdFromMiddleware, {
        image: uploadResult.filePath,
      });
    } catch (dbError) {
      const dbErrorMessage =
        dbError instanceof Error ? dbError.message : "Erro desconhecido";
      console.error(
        `[POST /api/v1/user/upload] Erro ao atualizar DB: ${dbErrorMessage}`,
      );
      return NextResponse.json(
        { error: "Erro ao salvar a foto no perfil" },
        { status: 500 },
      );
    }

    console.log(
      `[POST /api/v1/user/upload] Avatar atualizado com sucesso: ${uploadResult.filePath}`,
    );

    // 6. Revalidar cache
    revalidatePath("/perfil");
    revalidatePath("/", "layout"); // Atualiza Header

    // 7. Retornar usuário atualizado
    return NextResponse.json(
      {
        message: "Foto de perfil atualizada com sucesso",
        user: updatedUser,
        imageUrl: uploadResult.filePath,
      },
      { status: 200 },
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Erro desconhecido";
    console.error("[POST /api/v1/user/upload] Erro:", errorMessage);

    return NextResponse.json(
      { error: "Erro ao processar o upload" },
      { status: 500 },
    );
  }
}
