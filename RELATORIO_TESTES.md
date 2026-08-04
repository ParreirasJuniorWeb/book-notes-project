# Relatório Final de Testes (Thorough) — Backend API + Postgres

## 1) Objetivo
Validar a aplicação Node.js/Express com integração real ao PostgreSQL (`pg`), cobrindo rotas críticas e cenários de autenticação e CRUD de livros (criação/edição/exclusão), além de evoluir robustez de validação e padronização de respostas de erro.

---

## 2) Escopo coberto

### 2.1 Endpoints cobertos na suíte automatizada (Jest + Supertest)
- `GET /health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me` (autenticado via JWT)
- `GET /api/books` (autenticado)
- `GET /api/books/:id` (autenticado)
- `POST /api/books` (autenticado)
- `PUT /api/books/:id` (autenticado)
- `DELETE /api/books/:id` (autenticado)

### 2.2 Integração real de banco
- Pool Postgres ativo via `database/conn.js`
- Limpeza de base entre testes (`DELETE FROM books`, `DELETE FROM users`)
- Fechamento do pool ao final da suíte para reduzir handles abertos

### 2.3 Testes manuais críticos via curl (rodada complementar)
#### Autenticação
- `POST /api/auth/register` (válido) → `201 Created`
- `POST /api/auth/login` (válido) → `200 OK`
- `GET /api/auth/me` com token válido → `200 OK`
- `GET /api/auth/me` sem token → `401 Unauthorized`
- `GET /api/auth/me` com token inválido → `401 Unauthorized`

#### Livros (proteção + validação + CRUD)
- `POST /api/books` sem token → `401 Unauthorized`
- `POST /api/books` com `recommendation_text` vazio → `400 Bad Request`
- `POST /api/books` com `author_id` inválido → `400 Bad Request`
- `POST /api/books` válido → `201 Created`
- `GET /api/books/:id` inexistente (autenticado) → `404 Not Found`
- `GET /api/books/:id` sem token → `401 Unauthorized`
- `PUT /api/books/:id` com `recommendation_text` vazio → `400 Bad Request`
- `PUT /api/books/:id` com `author_id` inválido → `400 Bad Request`
- `PUT /api/books/:id` inexistente → `404 Not Found`
- `DELETE /api/books/:id` sem token → `401 Unauthorized`
- `DELETE /api/books/:id` inexistente com token → `404 Not Found`
- `DELETE /api/books/:id` existente com token → `200 OK`

#### Edge-cases de constraints (DB)
- `isbn` duplicado (UNIQUE) validado em execução real de API/DB
- `recommendation_note` fora do range (CHECK) validado em execução real de API/DB
- `author_id` inexistente (FK) validado em execução real de API/DB

### 2.4 Gateway frontend (EJS)
- `GET http://localhost:3000/` → `200 OK`, renderização da tela `login.ejs` confirmada.

---

## 3) Resultados quantitativos

- **Test Suites:** 3 passed, 3 total
- **Tests:** 10 passed, 10 total
- **Status final da suíte automatizada:** ✅ **100% dos testes atuais passaram**
- **Status dos testes manuais críticos (curl):** ✅ executados com sucesso para cenários listados acima

Arquivos de testes:
- `tests/integration/health.test.js`
- `tests/integration/auth.test.js`
- `tests/integration/books.test.js`

---

## 4) Principais correções e melhorias aplicadas

### 4.1 Correção de SQL no create de livros
**Arquivo:** `controllers/booksController.js`  
**Problema:** `INSERT` com incompatibilidade entre colunas e placeholders.  
**Correção:** ajuste para 8 placeholders:  
`VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`.

### 4.2 Ajuste de compatibilidade com schema em autenticação
**Arquivo:** `controllers/authController.js`  
**Problema:** referência indevida a coluna `profileimage` no retorno de autenticação/perfil.  
**Correção:**
- Remoção de retorno inválido no login.
- `getCurrentUser` alinhado para retornar `id, name, email`.

### 4.3 Encerramento de conexões de DB para testes
**Arquivos:** `database/conn.js`, `tests/helpers/testDb.js`  
**Correção:**
- Adição de `close()` em `database/conn.js` com `pool.end()`.
- `closeDatabase()` ajustado para usar `db.close()`.

### 4.4 Validação de payload no backend e gateway
**Arquivos:** `controllers/booksController.js`, `server.js`  
**Melhorias:**
- Backend (`createBook`, `updateBook`):
  - `title` obrigatório (com `trim`)
  - `recommendation_text` obrigatório (com `trim`)
  - `author_id` inteiro positivo
- Gateway (`POST /books` e `POST /books/:id/update`):
  - validação defensiva para impedir envio de payload inválido e retornar erro amigável no frontend.

### 4.5 Item B solicitado (edge-cases adicionais)
**Arquivo:** `controllers/booksController.js`  
**Implementado:**
- Validação explícita de `recommendation_note`:
  - aceita `null`, `undefined` e string vazia como `null`
  - quando informado, exige inteiro entre `1` e `5`
- Padronização de erros por código do Postgres em `createBook`/`updateBook`:
  - `23505` → `409 Conflict` (`Registro duplicado`)
  - `23503` → `400 Bad Request` (`Referência inválida`)
  - `23514` → `400 Bad Request` (`Violação de regra de validação`)

---

## 5) Evidências de qualidade obtidas

- Fluxo completo de autenticação validado (positivo e negativo).
- Fluxo CRUD de livros validado com autenticação e cenários de erro.
- Validações de entrada reforçadas em duas camadas:
  1) gateway frontend (EJS server)
  2) API backend (controllers)
- Tratamento de erros de banco evoluído para respostas de negócio mais consistentes (evitando resposta genérica 500 nos casos mapeados).

---

## 6) Observações de execução

- Ao final de `npm run test`, foi observado:
  - `Jest did not exit one second after the test run has completed`
- Interpretação:
  - possível handle assíncrono aberto no ambiente de testes.
- Recomendação:
  - executar com `--detectOpenHandles` para diagnóstico fino e eventual eliminação desse warning.

---

## 7) Riscos residuais e próximos passos recomendados

1. **Cobertura funcional completa de UI/EJS (pendente de navegação detalhada):**
   - fluxos completos em `/register`, `/login`, `/dashboard`, `/book/:id`, `/profile`, `/books/:id/update`, `/books/:id/delete`.
2. **Expansão de asserts automatizados para mensagens específicas de erro mapeado (409/400) em constraints.**
3. **Aprimorar observabilidade em testes:**
   - reduzir logs de query durante execução de Jest (ruído).
4. **Resolver warning de open handles no Jest** para suíte totalmente limpa.

---

## 8) Conclusão

A suíte de testes de integração foi implementada e permanece estável, com **3/3 suítes e 10/10 testes aprovados**.  
As correções estruturais em SQL/schema foram aplicadas, validações de entrada foram reforçadas, e a padronização de erros de constraints foi implementada no backend para maior previsibilidade da API.

**Resultado consolidado:** ✅ backend Express + PostgreSQL validado em cenários críticos (auth + CRUD + edge-cases), com melhorias concretas de robustez e qualidade.
