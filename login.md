# Role: Senior Full Stack Developer (Next.js & React Specialist)

## Contexto

dentro desta aplicação Next.js e preciso organizar a arquitetura global de componentes e criar uma nova funcionalidade de autenticação mantendo a consistência de design.

## Tarefas

### 1. Refatoração do `layout.tsx`

- Mova os componentes `Header` e `Footer` para o arquivo `src/layout.tsx`.
- Certifique-se de que eles sejam importados de forma estática para que persistam entre as mudanças de rota.
- No componente de Menu/Navbar, configure o link do item **"Entrar"** para apontar para a rota `/login`.

### 2. Criação da Página de Login (`app/login/page.tsx`)

- Desenvolva a página de Login utilizando o **mesmo estilo visual, classes CSS/Tailwind e estrutura de componentes** da página de cadastro já existente.
- O formulário deve conter campos de `e-mail` e `senha`.

### 3. Implementação do Fetch

- No evento de submissão do formulário de login, implemente uma função `handleSubmit`.
- Utilize a Fetch API para enviar os dados via método **POST** para o endpoint `api/v1/auth`.
- Inclua o tratamento básico de resposta (sucesso/erro) e o `Content-Type: application/json` no header da requisição.

## Requisitos Técnicos

- Use **TypeScript**.
- Utilize as convenções do **Next.js App Router**.
- Mantenha o código limpo, modular e com tratamento de estados (loading/error).

---

**Resultado esperado:** Forneça os blocos de código atualizados para o `layout.tsx` e o novo arquivo da página de login.
