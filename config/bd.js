const { Sequelize } = require('sequelize'); //importa o sequelize

const sequelize = new Sequelize({ //cria uma nova instância do sequelize, que é o que vai permitir a conexão com o banco de dados, é como se fosse um let a1 = new aluno() em TS
  dialect: 'sqlite', //tipo de BD
  storage: './bd.sqlite' //caminho do arquivo do banco de dados, que é o bd.sqlite, que está na raiz do projeto
});

module.exports = sequelize; //exporta para permitir arquivos como o app.js possam importar e usar a conexão com o banco de dados, que é o sequelize