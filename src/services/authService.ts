import db from "@/infra/db";
import passwordModule from "@/models/password";

interface AuthenticatedUser {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  emailVerified: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Autentica um usuário validando email e senha
 * @param email - Email do usuário
 * @param passwordInput - Senha fornecida pelo usuário
 * @returns Dados do usuário autenticado (sem a senha)
 * @throws Erro se o usuário não existir ou a senha for inválida
 */
async function getAuthenticatedUser(
  email: string,
  passwordInput: string,
): Promise<AuthenticatedUser> {
  // 1. Buscar o usuário no banco pelo email
  const user = await db.user.findUnique({
    where: { email },
  });

  // Se o usuário não existir, lançar erro
  if (!user) {
    throw new Error("Email ou senha incorretos");
  }

  // 2. Comparar a senha fornecida com o hash armazenado no banco
  const isPasswordValid = await passwordModule.comparePassword(
    passwordInput,
    user.password,
  );

  // Se a senha for inválida, lançar erro
  if (!isPasswordValid) {
    throw new Error("Email ou senha incorretos");
  }

  // 3. Retornar os dados do usuário (sem a senha)
  const userResponse: AuthenticatedUser = {
    id: user.id,
    email: user.email,
    name: user.name,
    image: user.image,
    emailVerified: user.emailVerified,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  return userResponse;
}

/**
 * Cria uma nova sessão para o usuário
 * @param userId - ID do usuário
 * @returns Dados da sessão criada
 */
async function createSession(userId: string) {
  const sessionToken = `${userId}-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;

  const session = await db.session.create({
    data: {
      userId,
      sessionToken,
      createdAt: new Date().toISOString(),
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
      updatedAt: new Date(),
    },
  });

  return session;
}

const authService = {
  getAuthenticatedUser,
  createSession,
};

export default authService;
