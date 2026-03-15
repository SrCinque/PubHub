# PubHub

Um projeto Next.js com integração completa de banco de dados PostgreSQL via Docker, Prisma ORM e automação de desenvolvimento.

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 18 ou superior)
- **npm** (versão 9 ou superior) ou **yarn**
- **Docker** e **Docker Compose** (para gerenciar serviços de banco de dados)
- **Git** (para clonar o repositório)

## Instalação

### 1. Clonar o Repositório

```bash
git clone https://github.com/SrCinque/PubHub.git
cd PubHub
```

### 2. Instalar Dependências

```bash
npm install
```

### 3. Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```bash
# Database URL para Prisma (usar a URL de desenvolvimento com Docker)
DATABASE_URL="postgresql://user:password@localhost:5432/pubhub"

# URL da aplicação
NEXT_PUBLIC_API_URL="http://localhost:3000"

# Ambiente
NODE_ENV="development"
```

> **⚠️ Importante**: A `DATABASE_URL` deve corresponder às credenciais configuradas no arquivo `infra/docker-composer.yaml`. O Docker Compose provisiona automaticamente o banco de dados PostgreSQL quando você sobe os serviços.

## Banco de Dados e Infraestrutura

### Fluxo de Setup Recomendado

Siga os passos na ordem correta para evitar problemas:

#### 1. Subir os Serviços Docker

```bash
npm run services:up
```

Este comando inicia os containers Docker (PostgreSQL) definidos em `infra/compose.yaml`.

#### 2. Gerar o Client do Prisma

```bash
npx prisma generate
```

Gera os tipos TypeScript e o cliente do Prisma baseado no `schema.prisma`.

#### 3. Rodar as Migrações

```bash
npx prisma migrate dev
```

Aplica as migrations do banco de dados. Na primeira execução, você será solicitado a nomear a initial migration.

### Desenvolvimento

Para desenvolvimento local, use:

```bash
npm run dev:all
```

Este comando roda o Next.js e o **Prisma Studio** simultaneamente:
- **Next.js**: Acessível em [http://localhost:3000](http://localhost:3000)
- **Prisma Studio**: Acessível em [http://localhost:5555](http://localhost:5555)

O Prisma Studio é uma interface visual para gerenciar dados do banco de dados em tempo real, facilitando o desenvolvimento e debugging.

#### Alternativas

Se preferir rodar apenas o Next.js:

```bash
npm run dev
```

Para parar os serviços Docker (sem destruir dados):

```bash
npm run services:stop
```

Para parar e remover containers:

```bash
npm run services:down
```

## Produção

### Build

Para criar uma build otimizada:

```bash
npm run build
```

### Deploy

Para iniciar o servidor em modo produção:

```bash
npm run start
```

A aplicação estará disponível em [http://localhost:3000](http://localhost:3000).

## Padronização de Commits

Este projeto utiliza **Commitizen** para padronizar mensagens de commit. Use:

```bash
npm run commit
```

Em vez de `git commit`, o Commitizen oferecerá um assistente interativo para criar mensagens bem estruturadas seguindo a convenção Conventional Commits.

Exemplos de commits bem formatados:
- `feat: adiciona autenticação com JWT`
- `fix: corrige erro ao fazer logout`
- `docs: atualiza README com instruções de setup`
- `refactor: reorganiza estrutura de pastas`

## Troubleshooting

### ❌ Erro: Database connection refused

**Causa**: O Docker não foi iniciado ou `npm run services:up` não foi executado.

**Solução**:
1. Verifique se o Docker está rodando
2. Execute `npm run services:up`
3. Aguarde alguns segundos para o PostgreSQL inicializar
4. Teste a conexão rodando `npx prisma db push`

### ❌ Erro: Unable to require @prisma/client

**Causa**: O Prisma Client não foi gerado.

**Solução**:
```bash
npx prisma generate
```

### ❌ Erro: Relations are not supported yet for the `generate` command

**Causa**: Seu modelo Prisma pode ter referências que precisam ser aplicadas primeiro.

**Solução**:
```bash
npx prisma migrate dev
npx prisma generate
```

### ❌ Porta 3000 já está em uso

**Solução**: Altere a porta na variável de ambiente ou finalize o processo usando a porta:

```bash
# Linux/Mac
lsof -i :3000

# Windows
netstat -ano | findstr :3000
```

## Estrutura do Projeto

```
PubHub/
├── src/
│   ├── app/                 # App Router do Next.js
│   ├── components/          # Componentes React
│   ├── services/            # Lógica de negócio
│   ├── models/              # Modelos de dados
│   └── types/               # Tipos TypeScript
├── prisma/
│   ├── schema.prisma        # Definição do modelo de dados
│   └── migrations/          # Histórico de migrations
├── infra/
│   ├── docker-composer.yaml # Configuração Docker
│   └── db.ts                # Cliente Prisma
├── .env.local               # Variáveis de ambiente (não commitado)
├── package.json             # Dependências e scripts
└── tsconfig.json            # Configuração TypeScript
```

## Recursos Úteis

- [Documentação Next.js](https://nextjs.org/docs) - Referência completa do Next.js
- [Documentação Prisma](https://www.prisma.io/docs/) - Guia de uso do Prisma ORM
- [Documentação PostgreSQL](https://www.postgresql.org/docs/) - Referência de SQL
- [Docker Compose Docs](https://docs.docker.com/compose/) - Orquestração de containers

## Suporte

Se encontrar problemas ou tiver dúvidas:

1. Verifique a seção **Troubleshooting** acima
2. Consulte a documentação oficial dos projetos dependentes
3. Abra uma issue no repositório do GitHub

---

**Desenvolvido com ❤️ usando Next.js, Prisma e Docker**
