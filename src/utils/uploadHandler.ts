import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { randomBytes } from "crypto";

/**
 * Configurações de upload
 */
const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 2 * 1024 * 1024, // 2MB em bytes
  ALLOWED_EXTENSIONS: ["jpg", "jpeg", "png", "webp"],
  UPLOAD_DIR: "public/uploads",
};

/**
 * Interface para resultado do upload
 */
interface UploadResult {
  success: boolean;
  filePath?: string;
  fileName?: string;
  error?: string;
}

/**
 * Valida se a extensão do arquivo é permitida
 */
function validateExtension(fileName: string): boolean {
  const ext = fileName.split(".").pop()?.toLowerCase();
  return ext ? UPLOAD_CONFIG.ALLOWED_EXTENSIONS.includes(ext) : false;
}

/**
 * Gera um nome único para o arquivo
 */
function generateFileName(originalName: string): string {
  const parts = originalName.split(".");
  const ext = parts.length > 1 ? parts.pop() : "unknown";
  const randomId = randomBytes(8).toString("hex");
  const timestamp = Date.now();
  return `${randomId}-${timestamp}.${ext}`;
}

/**
 * Processa o upload de um arquivo
 * @param fileName - Nome original do arquivo
 * @param buffer - Buffer do arquivo
 * @returns Resultado do upload com caminho relativo
 */
export async function handleFileUpload(
  fileName: string,
  buffer: Buffer,
): Promise<UploadResult> {
  try {
    // 1. Validar tamanho do arquivo
    if (buffer.length > UPLOAD_CONFIG.MAX_FILE_SIZE) {
      return {
        success: false,
        error: `Arquivo muito grande. Máximo permitido: ${UPLOAD_CONFIG.MAX_FILE_SIZE / 1024 / 1024}MB`,
      };
    }

    // 2. Validar extensão
    if (!validateExtension(fileName)) {
      return {
        success: false,
        error: `Extensão não permitida. Extensões aceitas: ${UPLOAD_CONFIG.ALLOWED_EXTENSIONS.join(", ")}`,
      };
    }

    // 3. Gerar nome único
    const uniqueFileName = generateFileName(fileName);

    // 4. Definir caminho completo
    const uploadPath = join(process.cwd(), UPLOAD_CONFIG.UPLOAD_DIR);

    // 5. Criar pasta se não existir
    await mkdir(uploadPath, { recursive: true });

    // 6. Salvar arquivo
    const fullPath = join(uploadPath, uniqueFileName);
    await writeFile(fullPath, buffer);

    // 7. Retornar URL relativa
    const relativeUrl = `/uploads/${uniqueFileName}`;

    console.log(`[Upload] Arquivo salvo com sucesso: ${relativeUrl}`);

    return {
      success: true,
      filePath: relativeUrl,
      fileName: uniqueFileName,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Erro desconhecido";
    console.error("[Upload] Erro ao processar arquivo:", errorMessage);
    return {
      success: false,
      error: `Erro ao processar o arquivo: ${errorMessage}`,
    };
  }
}
