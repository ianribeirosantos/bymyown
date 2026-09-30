const {DataTypes} = require('sequelize');
const sequelize = require('./../config/bd');

const Diretor = sequelize.define(
    'Diretor',
    {
        nome:{
            type: DataTypes.STRING,
            allowNull: false
        },
        anoNascimento:{
            type: DataTypes.DATE,
            allowNull: false
        },
        nacionalidade:{
            type: DataTypes.STRING,

        }
    },
    {
    tableName: 'Diretores',
    timestamps: true // o Sequelize vai preencher as colunas createdAt e updatedAt com a data e hora exata daquele momento.
    }
)

module.exports = Diretor;