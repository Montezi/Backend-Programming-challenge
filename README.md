# Backend-Programming-challenge


# Tecnologias Utilizadas :
* Node
* Express
* Postgres
* Sucrase
* Nodemon
* Sequelize
* ESLint
* Prettier
* Editorconfig
* Bcrypt
* Jsonwebtoken
* Yup
* Multer
* Express-async- errors
* Youch
* Dotenv
* Cors

# Rotas
```
Sessions
[POST] <host>/sessions

Users
[POST] <host>/users
*Para acessar as rotas abaixo é necessário passar o token de autenticação
[GET]  <host>/users
[GET]  <host>/users/:id
[PUT]  <host>/users
[DELETE] <host>/users/:id (*Somente perfil *admin pode deletar )

Panels
[POST] <host>/panels (rota criada para o insert dos dados do arquivo solar_data.json no BD)
*Para acessar as rotas abaixo é necessário passar o token de autenticação
[GET]  <host>/panels/
[GET]  <host>/panels/:state
Panels/search (*Para carregar os widgets e gráfico do Dashboard)
[GET]  <host>/panels/search/totalInstallation
[GET]  <host>/panels/search/maxInstallation
[GET] <host>/panels/search/maxNumberInstallation
[GET] <host>/panels/search/graph

Files
*Para acessar a rota abaixo é necessário passar o token de autenticação
[POST] <host>/files (Para upload da foto do Avatar)


```

# Instalação

**- Configuração**
  * Criar base de dados Postgres com o nome "challenge"; 

 * Criar uma cópia do arquivo .env.example e renomear o mesmo para .env ;
 * Editar as seguintes linhas :
 ```
  APP_URL =http://localhost:3333  => Alterar, se necessário, de localhost para o ip da máquina que a 
   aplicação será executada. 
  
  DB_HOST= ip da máquina da base de dados
  DB_USER= usuário do banco de dados
  DB_PASS= senha banco de dados
  DB_NAME= nome da base de dados (challenge)
 
 ```
  * Abrir o projeto no terminal e executar os seguintes comandos:


**- Se estiver utilizando Yarn**
```
  Todos os comandos abaixo devem ser excutados na raiz do Projeto 
  Para instalar as dependências:
  yarn install 
  
  Rodar as Migrations para criar a base de dados 
  yarn sequelize db:migrate
  
  Para startar o servidor :
  yarn dev
  
  Acessar um REST Client (Insomnia, Postman) e acessar a seguinte rota para inserir os dados das instalações:
  [POST] <host>/panels 
     
   
```

**- Se estiver utilizando npm**
```
  Todos os comandos abaixo devem ser excutados na raiz do Projeto 
  Para instalar as dependências:
  npm install   
  Rodar as Migrations para criar a base de dados 
  npx sequelize db:migrate
  
  Para startar a aplicação :
  npm run dev
  
  Acessar um REST Client (Insomnia, Postman) e acessar a seguinte rota para inserir os dados das instalações:
  [POST] <host>/panels 
  

```
