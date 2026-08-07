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
- [X] Validar comportamento de login/registro após configuração no Render
- [X] Atualizar PR com hotfix
## F) Hotfix Desenvolvimento (projeto local) - cadastro/edição/esclusão de livros
- [X] Veritifcar alguma inconsistência com o formato dos dados vindos do formulário de cadastro de livros e analisa-los para saber como estão chegando ao backend. 
  - Formato esperado no backend: 
  {
    **title**: string,
    **recommendation_text**: string,
    **recommendation_note**: number (int),
    **image**: string,
    **reading_dt**: string (new Date())
    **isbn**: string (20 caracteres)
    **summary**: string,
    **author_id**: number (int)
  }
- [X] Verificar se o formulário há alguma propriedade/valor, tal como 'multipart/form-data', que possa está impedindo a chegada dos dados no servidor Node.js/Express. 
- [X] Verificar o formato correto em que os dados estão chegando e se há compatibilidade com os dados exigidos pelo banco de dados. 
- [X] Verificar o formulário de submissão após a retida do 'multipart/form-data' do formulário. O formulário não faz upload de arquivos por isso não precisa ter o valor 'multipart/form-data' em um de seus atributos. 