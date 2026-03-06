import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import password from "@/models/password";
import user from "@/services/user";

const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Email e Senha",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "seu@email.com" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        // Validar se as credenciais foram fornecidas
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email e senha são obrigatórios");
        }

        // Buscar usuário pelo email
        const userData = await user.getByEmail(credentials.email as string);

        if (!userData) {
          throw new Error("Usuário ou senha inválidos");
        }

        // Comparar hash da senha
        const isPasswordValid = await password.comparePassword(
          credentials.password as string,
          userData.password,
        );

        if (!isPasswordValid) {
          throw new Error("Usuário ou senha inválidos");
        }

        // Retornar dados do usuário autenticado
        return {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          image: userData.image,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    /**
     * Callback JWT - executado quando um JWT é criado ou atualizado
     */
    async jwt({ token, user: nextAuthUser }) {
      if (nextAuthUser) {
        token.id = nextAuthUser.id;
        token.email = nextAuthUser.email;
      }
      return token;
    },

    /**
     * Callback de Sessão - garante que dados essenciais estejam disponíveis na sessão
     */
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { auth, handlers, signIn, signOut };
