// src/lib/db.ts
import { PrismaClient } from '../app/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

// Função para criar a instância do Prisma com o adaptador do PostgreSQL
const prismaClientSingleton = () => {
  // Configuração do pool de conexão do driver 'pg'
  const connectionString = `${process.env.DATABASE_URL}`;
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);

  // Retorna o PrismaClient utilizando o adaptador
  return new PrismaClient({ adapter });
};

// Configuração do Singleton para evitar múltiplas conexões em ambiente de desenvolvimento
declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const db = globalThis.prismaGlobal ?? prismaClientSingleton();

export default db;

// Em desenvolvimento, salvamos a instância no objeto global para o Fast Refresh do Next.js não criar novas conexões
if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = db;