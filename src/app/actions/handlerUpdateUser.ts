"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function handlerUpdateUser(
  userId: string,
  formData: { name?: string; image?: string },
) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session_token")?.value;

    if (!sessionToken) {
      return {
        success: false,
        message: "Sessão inválida. Faça login novamente.",
        status: 401,
      };
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

    const response = await fetch(`${apiUrl}/api/v1/user`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: `session_token=${sessionToken}`,
      },
      body: JSON.stringify({
        id: userId,
        ...formData,
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        message: error.error || "Erro ao atualizar perfil",
        status: response.status,
      };
    }

    const updatedUser = await response.json();

    // Revalidar cache da página de perfil para refletir as mudanças
    revalidatePath("/perfil");
    revalidatePath("/", "layout");

    return {
      success: true,
      message: "Perfil atualizado com sucesso!",
      user: updatedUser,
    };
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    return {
      success: false,
      message: "Erro ao atualizar perfil. Tente novamente.",
    };
  }
}
