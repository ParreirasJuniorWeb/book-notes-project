# TODO - Testes + Robustez API + Hotfix Render

## A) Suíte de testes automatizados (Jest + Supertest)
- [x] Configurar Jest para projeto ESM
- [x] Criar testes de integração para `/health`
- [x] Criar testes de integração para auth (`/api/auth/register`, `/api/auth/login`, `/api/auth/me`)
- [x] Criar testes de integração para books (`/api/books` CRUD + erros principais)
- [x] Executar suíte e validar resultados (10/10 passando)

## B) Robustez API (controllers/booksController.js)
- [x] Validar `recommendation_note` como inteiro no intervalo 1..5
- [x] Padronizar mapeamento de erros Postgres:
  - [x] `23505` -> 409
  - [x] `23503` -> 400
  - [x] `23514` -> 400
- [x] Retestar cenários de sucesso/erro após ajustes

## C) Relatório e evidências
- [x] Atualizar `RELATORIO_TESTES.md` com evidências automatizadas e manuais
- [x] Consolidar status de cobertura e pendências

## D) PR
- [x] Criar branch `blackboxai/test-suite-jest-postgres-pr`
- [x] Commit/push das alterações relevantes
- [x] Abrir PR no GitHub (#2)

## E) Hotfix produção (Render) - login/registro
- [x] Alterar frontend para usar `process.env.API_URL` em vez de URL fixa localhost
- [x] Exibir API_URL efetiva no log de startup
- [ ] Validar comportamento de login/registro após configuração no Render
- [ ] Atualizar PR com hotfix
