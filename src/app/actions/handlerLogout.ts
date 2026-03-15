"use client";

/**
 * Utilitário centralizado para logout
 * Pode ser importado por qualquer componente (Header, Sidebar, Perfil, etc)
 * 
 * Realiza um fetch DELETE para /api/v1/logout
 * Redireciona para / ao sucesso
 * Trata erros adequadamente
 */

export async function handlerLogout(): Promise<void> {
  try {
    // 1. Fazer requisição DELETE para o endpoint de logout
    const response = await fetch("/api/v1/logout", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Envia cookies na requisição
    });

    // 2. Validar se a resposta foi bem-sucedida
    if (response.ok) {
      // Status 200-299: Logout bem-sucedido
      console.log("Logout realizado com sucesso");

      // 3. Limpar qualquer estado local (se houver no localStorage)
      // Exemplo: se houver dados de usuário em localStorage
      localStorage.removeItem("user");
      localStorage.removeItem("preferences");
      // ... remova outras chaves conforme necessário

      // 4. Redirecionar para página inicial com reset completo do estado
      // window.location.href garante um reset completo do cliente
      window.location.href = "/";

      // O return abaixo nunca será atingido pois a página redirecionará
      return;
    }

    // Se a resposta não for ok (4xx ou 5xx)
    const errorData = await response.json();
    const errorMessage = errorData.error || `Erro no logout: ${response.status}`;
    throw new Error(errorMessage);
  } catch (error) {
    // 4. Tratar erros de rede ou respostas negativas
    const errorMessage =
      error instanceof Error ? error.message : "Erro desconhecido ao fazer logout";

    console.error("Erro ao fazer logout:", errorMessage);

    // Mostrar alerta visual ao usuário
    alert(`Falha ao fazer logout: ${errorMessage}`);

    // Opcional: você pode tentar redirecionar mesmo em caso de erro
    // para evitar que o usuário fique preso na página
    // window.location.href = "/";
  }
}
