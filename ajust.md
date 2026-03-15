# Role

Você é um Arquiteto de Software Sênior especializado em Next.js e Clean Code.

# Contexto

Preciso centralizar a lógica de encerramento de sessão. A página `/logout` será removida. O objetivo é ter um arquivo de utilitário `handlerLogout.ts` que possa ser importado por qualquer componente (Header, Sidebar, Perfil) para realizar o logout via API.

# Tarefas

## 1. Substituição do Handler Centralizado (`actions/handlerLogout.ts`)

- Substitua a função assíncrona exportada chamada `handlerLogout`.
- Esta função deve:
  1. Realizar um `fetch` para `/api/v1/logout` com o método **DELETE**.
  2. Validar se a resposta foi `ok` (status 200).
  3. Se for bem-sucedido, limpar qualquer estado local (se houver) e redirecionar o usuário para a página inicial (`/`) usando `window.location.href` para garantir um reset completo do estado do cliente.
  4. Tratar erros de rede ou respostas negativas do servidor com um `console.error` ou alerta.

## 3. Limpeza de Rotas

- Remova qualquer referência à antiga página `/logout`.

# Formato de Saída

- Código do arquivo `handlerLogout.ts` (Client-side utility).
- Código do endpoint `api/v1/logout/route.ts` (Server-side).
- Exemplo de uso do `handlerLogout` em um componente de botão (ex: `LogoutButton.tsx`).
