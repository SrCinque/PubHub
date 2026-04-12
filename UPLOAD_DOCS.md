# Documentação: Sistema de Upload de Foto de Perfil

## Visão Geral

Este sistema permite que usuários façam upload de suas fotos de perfil. As imagens são:

- Armazenadas na pasta `./public/uploads`
- Servidas como arquivos estáticos via Next.js
- Persistidas no banco de dados (campo `image` do modelo User)

---

## 📁 Arquitetura

```
PubHub/
├── public/
│   └── uploads/           # Pasta criada automaticamente no primeiro upload
│       └── {id}-{timestamp}.jpg
├── src/
│   ├── utils/
│   │   └── uploadHandler.ts       # Funções de processamento de arquivo
│   ├── app/
│   │   └── api/v1/user/
│   │       └── upload/
│   │           └── route.ts       # Route Handler POST
│   └── services/
│       └── user.ts               # Service atualizada
└── next.config.ts               # Configuração para servir uploads
```

---

## 🔒 Segurança

### Validações Implementadas:

1. **Autenticação:**
   - Requer header `x-user-id` do middleware
   - Apenas usuários autenticados podem fazer upload

2. **Validação de Arquivo:**
   - Tamanho máximo: **2MB**
   - Extensões permitidas: `jpg`, `jpeg`, `png`, `webp`
   - Buffer validado antes de salvar

3. **Nomeação Segura:**
   - Nomes são renomeados com UUID + timestamp
   - Exemplo: `a1b2c3d4e5f6g7h8-1712973456789.jpg`
   - Evita colisões e acesso malicioso

---

## 🚀 Como Funciona

### 1. Upload Flow

```
Cliente submite FormData com arquivo
         ↓
Route Handler recebe em /api/v1/user/upload (POST)
         ↓
Middleware valida autenticação (x-user-id)
         ↓
handleFileUpload() processa:
  - Valida tamanho (2MB max)
  - Valida extensão (jpg, png, webp)
  - Renomeia com UUID + timestamp
  - Cria pasta ./public/uploads se não existir
  - Salva arquivo no FS
         ↓
Service user.update() persiste URL no banco (campo `image`)
         ↓
Retorna usuário atualizado com URL da imagem
         ↓
Cache revalidado (/perfil, /)
```

### 2. Endpoints

#### POST `/api/v1/user/upload`

```bash
curl -X POST http://localhost:3000/api/v1/user/upload \
  -H "Cookie: session_token=..." \
  -F "file=@/path/to/photo.jpg"
```

**Response (Success - 200):**

```json
{
  "message": "Foto de perfil atualizada com sucesso",
  "user": {
    "id": "user123",
    "email": "user@example.com",
    "image": "/uploads/a1b2c3d4e-1712973456789.jpg",
    ...
  },
  "imageUrl": "/uploads/a1b2c3d4e-1712973456789.jpg"
}
```

**Response (Error - 400/401/500):**

```json
{
  "error": "Arquivo muito grande. Máximo permitido: 2MB"
}
```

---

## 📋 Campos Alterados

### 1. Schema Prisma

Já existe campo `image` no modelo User (nullable string):

```prisma
model User {
  id     String  @id @default(cuid())
  name   String?
  image  String?  // URL relativa: /uploads/foto.jpg
  ...
}
```

### 2. Service `user.ts`

Função `update()` agora atualiza automaticamente `updatedAt`:

```typescript
async function update(id: string, data: { name?: string; image?: string }) {
  return await db.user.update({
    where: { id },
    data: {
      ...data,
      updatedAt: new Date(),
    },
  });
}
```

### 3. Route Handler GET `/api/v1/user`

Retorna usuário com campo `image` preenchido:

```json
{
  "id": "user123",
  "name": "João",
  "email": "joao@example.com",
  "image": "/uploads/avatar.jpg",
  "emailVerified": true,
  "createdAt": "2024-04-10T10:00:00Z",
  "updatedAt": "2024-04-12T15:30:00Z"
}
```

---

## 🔧 Configuração Necessária

### next.config.ts

A pasta `public/uploads` é servida automaticamente como estática:

```typescript
// Não precisa de configuração especial no Next.js 13+
// A pasta public/ é automaticamente servida em /
```

### Criar pasta uploads (opcional)

```bash
mkdir -p public/uploads
```

---

## 📚 Uso Frontend

Será implementado no componente `ClientProfileForm`:

```typescript
const handleImageUpload = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/v1/user/upload", {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  const data = await response.json();
  return data.imageUrl; // /uploads/...
};
```

---

## ✅ Checklist de Implementação

- ✅ `src/utils/uploadHandler.ts` - Processamento de arquivo
- ✅ `src/app/api/v1/user/upload/route.ts` - Route Handler
- ✅ `src/services/user.ts` - Atualizado com updatedAt
- ✅ Schema Prisma - Campo `image` já existe
- ✅ Middleware - Já protege `/api/v1/user/*`
- ⏳ Frontend - A ser integrado no `ClientProfileForm`

---

## 🐛 Troubleshooting

### Erro: "Arquivo muito grande"

- Limite é 2MB
- Reduza tamanho da imagem
- Ou atualize `MAX_FILE_SIZE` no `uploadHandler.ts`

### Erro: "Extensão não permitida"

- Use apenas: jpg, jpeg, png, webp
- Converta a imagem se necessário

### Imagem não aparece após upload

- Verifique se pasta `public/uploads` foi criada
- Confirme que arquivo foi salvo em `public/uploads/`
- Verifique URL retornada no JSON response

### Cache não atualiza

- Páginas revalidadas automaticamente
- Se não funcionar, faça reload manual (F5)

---

## 📊 Exemplo de Fluxo Completo

1. Usuário entra na tela `/perfil`
2. Clica no avatar ou botão "Alterar Foto"
3. Seleciona arquivo PNG (500KB)
4. POST para `/api/v1/user/upload` com FormData
5. Backend:
   - Valida autenticação ✓
   - Valida tamanho (500KB < 2MB) ✓
   - Valida extensão (png permitido) ✓
   - Renomeia: `a1b2c3d4-1712973456789.png`
   - Salva em: `public/uploads/a1b2c3d4-1712973456789.png`
   - Atualiza DB: User.image = "/uploads/a1b2c3d4-1712973456789.png"
   - Revalida cache
6. Frontend recebe URL: `/uploads/a1b2c3d4-1712973456789.png`
7. Imagem exibida no perfil
8. Header atualizado com nova foto

---

## 🚨 Notas Importantes

- **Pasta public/uploads**: Criada automaticamente no primeiro upload
- **URLs relativas**: Armazenadas como `/uploads/nome.jpg`
- **Acesso público**: Qualquer pessoa pode acessar via navegador
- **Backup**: Considere fazer backup da pasta `public/uploads` em produção
- **Limpeza**: Implemente rotina para limpar uploads deletados/antigos
