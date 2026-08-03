# 🔐 Login & Cadastro - Interface de Autenticação
Este projeto é uma interface de autenticação que inclui telas de login e cadastro. Ele foi desenvolvido usando HTML, CSS e JavaScript, proporcionando uma experiência de usuário intuitiva e responsiva.
## Funcionalidades
- Tela de Login: Permite que os usuários façam login usando seu email e senha.
- Tela de Cadastro: Permite que os novos usuários criem uma conta fornecendo seu nome, email e senha.
- Validação de Formulário: As entradas do usuário são validadas para garantir que os dados sejam inseridos corretamente.
- Design Responsivo: A interface é adaptável a diferentes tamanhos de tela, garantindo uma boa experiência em dispositivos móveis e desktops.
- Feedback Visual: Mensagens de erro e sucesso são exibidas para orientar os usuários durante o processo de login e cadastro.
- Integração com Backend: A interface pode ser facilmente integrada com um backend para autenticação real, utilizando APIs RESTful.
- Segurança: As senhas são hashadas antes de serem armazenadas, garantindo a segurança dos dados dos usuários.
- Usuários poderão criar anotações de livros que já leram, com título, autor, data de leitura e uma breve resenha.
- Os usuários poderão visualizar, editar e excluir suas anotações de livros a qualquer momento, 
desde que a anotação do livro tenha o respectivo autor, puxa através do ID do usuário com o atributo de relacionamento da tabela de livros id_author.
- A interface de login e cadastro é protegida, garantindo que apenas usuários autenticados possam acessar as funcionalidades de criação, visualização, edição e exclusão de anotações de livros.
- O sistema de autenticação é implementado usando JWT (JSON Web Tokens), garantindo uma autenticação segura e eficiente para os usuários.
- O backend é desenvolvido usando Node.js e Express, com um banco de dados PostgreSQL para armazenar as informações dos usuários e suas anotações de livros.
- A interface é construída usando HTML, CSS e JavaScript, proporcionando uma experiência de usuário intuitiva e responsiva.
- O projeto é estruturado de forma modular, facilitando a manutenção e a escalabilidade do código.
- O código é bem documentado, com comentários explicativos para facilitar a compreensão e a colaboração com outros desenvolvedores.
- O projeto é de código aberto, permitindo que outros desenvolvedores contribuam com melhorias e novas funcionalidades.
- O projeto é hospedado em um repositório público, facilitando o acesso e a colaboração da comunidade de desenvolvedores.
- O projeto é atualizado regularmente, com melhorias e correções de bugs para garantir a melhor experiência possível para os usuários.
- O projeto é testado rigorosamente para garantir a funcionalidade correta e a segurança dos dados dos usuários.
## Tecnologias Utilizadas
- HTML5: Para estruturar as páginas de login e cadastro.
- CSS3: Para estilizar as páginas e criar um design atraente e responsivo.
- JavaScript: Para adicionar interatividade e validação de formulários.
- Node.js: Para criar um servidor simples que lida com as requisições de login e cadastro.
- JWT (JSON Web Tokens): Para autenticação segura dos usuários.
- banco de dados PostgreSQL: Para armazenar as informações dos usuários de forma segura.
- bcrypt: Para hash de senhas, garantindo a segurança dos dados dos usuários.
- Express.js: Para criar rotas e gerenciar as requisições do servidor.
- cors: Para permitir requisições de diferentes origens, facilitando a comunicação entre o frontend e o backend.
- dotenv: Para gerenciar variáveis de ambiente, como credenciais do banco de dados e chaves secretas.
- nodemon: Para facilitar o desenvolvimento, reiniciando automaticamente o servidor quando mudanças são detectadas.
- axios: Para fazer requisições HTTP do frontend para o backend, facilitando a comunicação entre as duas partes da aplicação.
- body-parser: Para analisar o corpo das requisições HTTP, permitindo que o servidor processe os dados enviados pelo frontend.
- ejs: Para renderizar páginas dinâmicas no servidor, facilitando a criação de interfaces de usuário personalizadas.
## Instalação
1. Clone o repositório:
```bash
git clone <URL_DO_REPOSITORIO>
```
2. Navegue até o diretório do projeto:
```bash
cd login-cadastro-interface
```
3. Instale as dependências do backend:
```bash
npm install
```
4. Configure as variáveis de ambiente:
Crie um arquivo `.env` na raiz do projeto e adicione as seguintes variáveis:
```env
DATABASE_URL=postgres://usuario:senha@localhost:5432/nome_do_banco
JWT_SECRET=sua_chave_secreta
```
5. Inicie o servidor:
```bash
npm start
```
6. Abra o arquivo `index.html` no seu navegador para acessar a interface de login e cadastro.
## Contribuição
Contribuições são bem-vindas! Se você tiver sugestões ou melhorias, sinta-se à vontade para abrir uma issue ou enviar um pull request.
## Licença
Este projeto está licenciado sob a MIT License. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
## Contato
Se você tiver alguma dúvida ou quiser entrar em contato, envie um email para [seu-email](mailto:joaoparreiras2020@gmail.com).
## Agradecimentos
- Agradeço a todos que contribuíram para este projeto e aos recursos online que me ajudaram a aprender e desenvolver esta interface de autenticação.
- Este projeto foi inspirado por diversos tutoriais e exemplos encontrados na internet, e é uma ótima maneira de praticar habilidades de desenvolvimento web.
- Obrigado por visitar este repositório e espero que seja útil para seus projetos de autenticação!
## Autor
- João Parreiras - [GitHub](https://github.com/ParreirasJuniorWeb) - [LinkedIn](https://www.linkedin.com/in/jvparreiras/) - [Email](mailto:joaoparreiras2020@gmail.com)
## Versão
- Versão 1.0.0 - Lançamento inicial da interface de autenticação
## Status do Projeto
- Em desenvolvimento - Funcionalidades básicas implementadas, melhorias e novas funcionalidades planejadas para futuras versões.
## Recursos Adicionais
- Documentação detalhada do código e comentários para facilitar a compreensão e manutenção do projeto.
- Exemplos de uso e testes para garantir a funcionalidade correta da interface de autenticação.
- Suporte para futuras integrações com serviços de terceiros, como OAuth para login social.
## Feedback
Se você tiver feedback ou sugestões para melhorar este projeto, por favor, não hesite em entrar
em contato. Sua opinião é muito importante para mim e ajudará a tornar este projeto ainda melhor!
## Agradecimentos Finais
Agradeço a todos que contribuíram para este projeto, seja com código, sugestões ou feedback. Este projeto é resultado de um esforço colaborativo e estou muito grato por ter uma comunidade tão incrível ao meu redor. Obrigado por fazer parte desta jornada de desenvolvimento!