const { Sequelize } = require('sequelize')

const db = new Sequelize('db_compras', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306
})

module.exports = db;