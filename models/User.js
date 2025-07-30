const {DataTypes} = require('sequelize') 

const db = require('../db/conn')

const User = db.define('User', {
    nome: {
        type: DataTypes.STRING,
        allowNull: false,
    },

     especie: {
        type: DataTypes.STRING,
        allowNull: false,
    },

     raca: {
        type: DataTypes.STRING,
        allowNull: false,
    },

     idade: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

     sexo: {
        type: DataTypes.STRING,
        allowNull: false,
    },

     nomeDoTutor: {
        type: DataTypes.STRING,
        allowNull: false,
    },
})

module.exports = User