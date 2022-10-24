const Sequelize = require('sequelize');
const connection = require('../database/database');
const Category = require('../categories/Category');

const Produtos = connection.define('produtos', {
    image:{
        type: Sequelize.STRING,
        allowNull: false
    }, codigo:{
        type: Sequelize.STRING,
        allowNull: false
    }, title:{
        type: Sequelize.STRING,
        allowNull: false
    }, slug: {
        type: Sequelize.STRING,
        allowNull: false
    }, preco:{
        type: Sequelize.STRING,
        allowNull: false
    }, estoque:{
        type: Sequelize.STRING,
        allowNull: false
    }
})

Category.hasMany(Produtos); // UMA CATEGORIA TEM MUITOS ARTIGOS - CRIANDO RELACIONAMENTO 1 X MUITOS
Produtos.belongsTo(Category); //UM ARTIGO PERTENCE A UMA CATEGORIA - CRIANDO RELACIONAMENTO ENTRE TABELAS 1X1

/* Produtos.sync({force: true}); */

module.exports = Produtos;