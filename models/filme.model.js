const { DataTypes } = require('sequelize'); 
const sequelize = require('../config/bd'); 

const Filme = sequelize.define( 
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
    timestamps: true 
  }
);

module.exports = Filme;