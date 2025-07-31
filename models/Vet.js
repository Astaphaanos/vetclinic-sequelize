const {DataTypes} = require('sequelize')

const db = require('../db/conn')
const User = require('./User')

const Vet = db.define('Vet', {
    veterinario: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

Vet.hasMany(User)
User.belongsTo(Vet)

module.exports = Vet