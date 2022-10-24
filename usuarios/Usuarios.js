const Sequelize = require('sequelize');
const connection = require('../database/database');

const Usuarios = connection.define('usuarios', {
    nome:{
        type: Sequelize.STRING,
        allowNull: false
    },email:{
        type: Sequelize.STRING,
        allowNull: false
    }, password:{
        type: Sequelize.STRING,
        allowNull: false
    }
})

/* Usuarios.sync({force: true}); */

module.exports = Usuarios;
