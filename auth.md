# Role: Backend Engineer (Node.js/Next.js & Prisma Expert)

## Contexto

Preciso implementar a lógica de autenticação no backend da aplicação. O objetivo é criar a rota de API e as funções de serviço necessárias para validar o usuário e gerenciar sessões usando Prisma ORM.

## Tarefas

### 1. Rota de API (`api/v1/auth/route.ts`)

- Crie o método **POST** para o endpoint de autenticação.
- Desencapsule os campos `email` e `password` do corpo da requisição (`request.json()`).
- Chame a função `getAuthenticatedUser` da service de autenticação.
- Em caso de sucesso, retorne o usuário e os dados da sessão; em caso de falha, retorne um erro 401 (Unauthorized).

### 2. Service de Autenticação (`services/authService.ts`)

- Implemente a função `getAuthenticatedUser(email, password)`.
- Esta função deve:
  1. Utilizar a service `UserService.getUserByEmail(email)` para buscar o usuário no banco.
  2. Realizar o `compare` da senha enviada com o hash armazenado no banco (utilize a biblioteca **bcrypt** já importada no projeto ).
  3. Retornar os dados do usuário se as credenciais forem válidas ou lançar um erro caso contrário.

### 3. Gerenciamento de Sessão (Prisma)

- Baseado no model `Session` do arquivo `schema.prisma`, crie a função `createSession(userId)`.
- A função deve gerar um registro no banco de dados vinculando o usuário a uma nova sessão e retornar o token/ID gerado.

## Requisitos Técnicos

- Use **TypeScript** rigorosamente.
- Utilize o **Prisma Client** para operações de banco de dados.
- Garanta que a senha nunca seja retornada no JSON de resposta do usuário.
- Aplique tratamento de erros `try/catch` robusto.

---

**Resultado esperado:** Forneça o código para a rota de API, a `authService` e a implementação da função de sessão.
