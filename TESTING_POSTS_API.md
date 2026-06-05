# Guia de Teste dos Endpoints de Posts

## Resumo dos Endpoints Implementados

### 1. GET /api/v1/posts

- **Descrição:** Lista todos os posts ordenados por mais recentes primeiro
- **Autenticação:** Requerida (via middleware - headers com x-user-id)
- **Response:** Array de posts com dados do autor inclusos
- **Status esperado:** 200 (sucesso) ou 401 (não autenticado)

### 2. POST /api/v1/posts

- **Descrição:** Cria um novo post para o usuário logado
- **Autenticação:** Requerida
- **Body esperado:** FormData com "content" (obrigatório) e "file" (opcional - imagem)
- **Response:** Post criado com dados completos
- **Status esperado:** 201 (criado) | 400 (dados inválidos) | 401 (não autenticado)
- **Tipos de arquivo aceitos:** jpg, jpeg, png, webp
- **Tamanho máximo:** 2MB

### 3. PATCH /api/v1/posts/[id]

- **Descrição:** Atualiza parcialmente um post (conteúdo e/ou imagem)
- **Autenticação:** Requerida
- **Autorização:** Apenas o autor pode editar
- **Body esperado:** FormData com "content" (opcional) e "file" (opcional - imagem)
- **Response:** Post atualizado
- **Status esperado:** 200 (sucesso) | 400 (dados inválidos) | 401 (não autenticado) | 403 (não autorizado) | 404 (post não encontrado)

### 4. PUT /api/v1/posts/[id]

- **Descrição:** Substitui completamente um post
- **Autenticação:** Requerida
- **Autorização:** Apenas o autor pode editar
- **Body esperado:** FormData com "content" (obrigatório) e "file" (opcional - imagem)
- **Response:** Post atualizado
- **Status esperado:** 200 (sucesso) | 400 (dados inválidos) | 401 (não autenticado) | 403 (não autorizado) | 404 (post não encontrado)

### 5. DELETE /api/v1/posts/[id]

- **Descrição:** Deleta um post permanentemente
- **Autenticação:** Requerida
- **Autorização:** Apenas o autor pode deletar
- **Response:** Mensagem de sucesso
- **Status esperado:** 200 (sucesso) | 401 (não autenticado) | 403 (não autorizado) | 404 (post não encontrado)

---

## Configuração no Insomnia

### 1. Criar uma Nova Collection

- Abra o Insomnia
- Crie uma nova Collection chamada "PubHub API - Posts"

### 2. Configurar Environment Variable

- Vá para `Manage Environments`
- Crie um novo environment chamado "Development" com as variáveis:
  ```
  BASE_URL: http://localhost:3000
  token: <seu-session-token-aqui>
  post_id: <id-do-post-aqui>
  ```

### 3. Criar Requisição: GET /api/v1/posts

**Request:**

```
Método: GET
URL: {{ BASE_URL }}/api/v1/posts
Headers:
  - Content-Type: application/json
  - x-user-id: <user-id-aqui>
  - x-user-email: <email-aqui>
```

**Esperado:**

- Status: 200
- Body:
  ```json
  [
    {
      "id": "post123",
      "content": "Meu primeiro post!",
      "imageUrl": null,
      "createdAt": "2026-05-11T10:30:00Z",
      "userId": "user123",
      "user": {
        "id": "user123",
        "name": "João Silva",
        "email": "joao@example.com",
        "image": null
      }
    }
  ]
  ```

### 4. Criar Requisição: POST /api/v1/posts

**Request:**

```
Método: POST
URL: {{ BASE_URL }}/api/v1/posts
Headers:
  - x-user-id: <user-id-aqui>
  - x-user-email: <email-aqui>

Body (Form-data):
  - content: "Este é meu novo post no PubHub!" (texto)
  - file: <selecionar arquivo de imagem> (opcional - jpg, jpeg, png, webp até 2MB)
```

**Esperado:**

- Status: 201
- Body: Post criado com id gerado automaticamente e URL da imagem se upload foi realizado
  ```json
  {
    "id": "post123",
    "content": "Este é meu novo post no PubHub!",
    "imageUrl": "/uploads/random-1715417400000.jpg",
    "createdAt": "2026-05-11T10:30:00Z",
    "userId": "user123",
    "user": {
      "id": "user123",
      "name": "João Silva",
      "email": "joao@example.com",
      "image": null
    }
  }
  ```

**Testes de Erro:**

- Sem "content": Status 400, erro "Conteúdo do post é obrigatório"
- Content vazio: Status 400, erro "Conteúdo do post não pode estar vazio"
- Arquivo maior que 2MB: Status 400, erro com detalhes
- Arquivo inválido (tipo não suportado): Status 400, erro "Extensão não permitida"
- Sem headers de autenticação: Status 401, erro "Usuário não autenticado"

### 5. Criar Requisição: PATCH /api/v1/posts/[id]

**Request:**

```
Método: PATCH
URL: {{ BASE_URL }}/api/v1/posts/{{ post_id }}
Headers:
  - x-user-id: <user-id-aqui>
  - x-user-email: <email-aqui>

Body (Form-data):
  - content: "Post atualizado com novo conteúdo!" (texto, opcional)
  - file: <selecionar arquivo de imagem> (opcional - jpg, jpeg, png, webp até 2MB)
```

**Esperado:**

- Status: 200
- Body: Post atualizado com novos dados

**Testes de Erro:**

- Content vazio (se fornecido): Status 400, erro "Conteúdo do post não pode estar vazio"
- Arquivo inválido: Status 400, erro com detalhes
- ID inválido/inexistente: Status 404
- Editando post de outro usuário: Status 403
- Sem headers de autenticação: Status 401

### 6. Criar Requisição: PUT /api/v1/posts/[id]

**Request:**

```
Método: PUT
URL: {{ BASE_URL }}/api/v1/posts/{{ post_id }}
Headers:
  - x-user-id: <user-id-aqui>
  - x-user-email: <email-aqui>

Body (Form-data):
  - content: "Conteúdo completamente novo" (texto, obrigatório)
  - file: <selecionar arquivo de imagem> (opcional - jpg, jpeg, png, webp até 2MB)
```

**Esperado:**

- Status: 200
- Body: Post atualizado com novos dados

**Testes de Erro:**

- Sem "content": Status 400, erro "Conteúdo do post é obrigatório"
- Content vazio: Status 400, erro "Conteúdo do post não pode estar vazio"
- Arquivo inválido: Status 400, erro com detalhes
- ID inválido/inexistente: Status 404
- Editando post de outro usuário: Status 403
- Sem headers de autenticação: Status 401

### 7. Criar Requisição: DELETE /api/v1/posts/[id]

**Request:**

```
Método: DELETE
URL: {{ BASE_URL }}/api/v1/posts/{{ post_id }}
Headers:
  - x-user-id: <user-id-aqui>
  - x-user-email: <email-aqui>
```

**Esperado:**

- Status: 200
- Body: `{ "message": "Post deletado com sucesso" }`

---

## Fluxo de Teste Recomendado

1. **Autenticar** - Faça login na aplicação para obter a sessão ativa
2. **Listar Posts** - GET /api/v1/posts para ver todos os posts
3. **Criar Post** - POST /api/v1/posts com conteúdo de teste
4. **Atualizar com PATCH** - Modifique apenas o conteúdo
5. **Atualizar com PUT** - Substitua conteúdo e imagem
6. **Listar Novamente** - Confirme que as alterações foram aplicadas
7. **Deletar** - DELETE /api/v1/posts/[id] para remover o post
8. **Verificar Deletion** - GET /api/v1/posts e confirme que o post foi removido

---

## Testes de Segurança

### Teste de Autorização (Não permitido editar post de outro usuário)

```
1. Criar um post com usuário A
2. Tentar editar esse post com usuário B
3. Esperado: Status 403 - "Você não tem permissão para editar este post"
```

### Teste de Autenticação (Sem headers de sessão)

```
1. Fazer GET em /api/v1/posts SEM x-user-id header
2. Esperado: Status 401 - "Usuário não autenticado"
```

---

## Configuração no Postman

### 1. Criar Collection

- File → New → Collection
- Nome: "PubHub - Posts API"

### 2. Configurar Environment Variables

- Clicar em "Environments" → Create
- Variables:
  - BASE_URL: http://localhost:3000
  - USER_ID: (obter do seu usuário autenticado)
  - USER_EMAIL: (seu email)
  - POST_ID: (id do post para testes)

### 3. Adicionar Requests

Para cada endpoint descrito acima, criar uma nova request em Postman com:

- URL: `{{ BASE_URL }}/api/v1/posts`
- Headers pré-configurados
- Body conforme especificado

### 4. Pre-request Script

Adicionar um script para garantir que os headers estão sempre configurados:

```javascript
pm.request.headers.add({
  key: "x-user-id",
  value: pm.environment.get("USER_ID"),
});
pm.request.headers.add({
  key: "x-user-email",
  value: pm.environment.get("USER_EMAIL"),
});
```

---

## Troubleshooting

### Erro 401 - "Usuário não autenticado"

- Verifique se você está autenticado na aplicação
- Confirme se os headers `x-user-id` e `x-user-email` estão sendo enviados
- Verifique se o middleware está ativo e injetando os headers

### Erro 404 - "Post não encontrado"

- Confirme que o ID do post existe
- Use GET /api/v1/posts para listar e copiar um ID existente

### Erro 403 - "Você não tem permissão"

- Confirme que você é o autor do post
- Verifique o `userId` do post e compare com seu `x-user-id`

### Erro 500 - "Erro ao X post"

- Verifique os logs do servidor
- Confirme que a conexão com o banco de dados está ativa
- Verifique se a migration foi executada com sucesso

---

## Exemplo cURL para Testes Rápidos

### Listar Posts

```bash
curl -X GET "http://localhost:3000/api/v1/posts" \
  -H "x-user-id: user123" \
  -H "x-user-email: user@example.com"
```

### Criar Post (sem imagem)

```bash
curl -X POST "http://localhost:3000/api/v1/posts" \
  -H "x-user-id: user123" \
  -H "x-user-email: user@example.com" \
  -F "content=Novo post no PubHub"
```

### Criar Post (com imagem)

```bash
curl -X POST "http://localhost:3000/api/v1/posts" \
  -H "x-user-id: user123" \
  -H "x-user-email: user@example.com" \
  -F "content=Novo post com imagem" \
  -F "file=@/path/to/image.jpg"
```

### Atualizar Post (PATCH - apenas conteúdo)

```bash
curl -X PATCH "http://localhost:3000/api/v1/posts/post123" \
  -H "x-user-id: user123" \
  -H "x-user-email: user@example.com" \
  -F "content=Conteúdo atualizado"
```

### Atualizar Post (PATCH - com nova imagem)

```bash
curl -X PATCH "http://localhost:3000/api/v1/posts/post123" \
  -H "x-user-id: user123" \
  -H "x-user-email: user@example.com" \
  -F "content=Conteúdo atualizado" \
  -F "file=@/path/to/new-image.png"
```

### Atualizar Post (PUT - com imagem)

```bash
curl -X PUT "http://localhost:3000/api/v1/posts/post123" \
  -H "x-user-id: user123" \
  -H "x-user-email: user@example.com" \
  -F "content=Conteúdo completamente novo" \
  -F "file=@/path/to/image.jpg"
```

### Deletar Post

```bash
curl -X DELETE "http://localhost:3000/api/v1/posts/post123" \
  -H "x-user-id: user123" \
  -H "x-user-email: user@example.com"
```
