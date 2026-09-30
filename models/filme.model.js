const { DataTypes } = require('sequelize'); //tipo de dado, pode ser string, integer e etc
const sequelize = require('../config/bd'); 

const Filme = sequelize.define( //define é uma função do sequelize que cria uma tabela no banco de dados, e o primeiro parâmetro é o nome da tabela, e o segundo parâmetro é um objeto com as colunas da tabela, e o terceiro parâmetro é um objeto com as opções da tabela.
  'Filme', 
  {
    nome: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ano: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    tableName: 'Filmes',
    timestamps: true //se deve ou não criar o createdat e updatedat
  }
);

module.exports = Filme;