const Sequelize = require('sequelize');

const conn = new Sequelize('catalogo_produtos', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql',
    timezone: "-03:00"
});



module.exports = conn;